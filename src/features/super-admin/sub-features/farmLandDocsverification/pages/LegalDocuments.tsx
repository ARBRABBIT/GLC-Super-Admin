import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';
import { useGetFarmlandLegalDocsStatusQuery } from '@/features/super-admin/api/farmland.api';
import { useVerificationFlow } from '../hooks/useVerificationFlow';
import { TabsCard, CommentsSection, FooterActions } from '../components/SharedUI';
import { FileRow } from '../components/Icons';
import { RejectModal } from '../components/Modals';
import { useFileDownload } from '@/features/super-admin/utils/useFileDownload';
import { useApproveFarmlandTabMutation, useRevertFarmlandTabMutation } from '@/features/super-admin/api/farmlandAction.api';
import { useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/store/authSlice';

const TAB_CODE_MAPPING: Record<string, string> = {
  'LDDMT': 'land-document',
  'PTDPB': 'pattadhar-passbook',
  'LNDMT': 'link-document',
  'KSRPN': 'kasara-pahani',
  'RVERR': 'revenue-record',
  'LSAGM': 'lease-agreement',
  'DTCFT': 'death-certificate',
  'PTNDD': 'partition-deed',
  'EBCFT': 'encumbrance-certificate',
  'LDCDN': 'land-coordinates',
  'OWKYV': 'owner-video-kyc',
};

const BASE_TABS: DocumentTab[] = [
  { id: 'land-document', label: 'Land Document', status: 'pending', code: 'LDDMT' },
  { id: 'pattadhar-passbook', label: 'Pattadhar Passbook', status: 'pending', code: 'PTDPB' },
  { id: 'link-document', label: 'Link Document', status: 'pending', code: 'LNDMT' },
  { id: 'kasara-pahani', label: 'Kasara Pahani & Proceeding Copies', status: 'pending', code: 'KSRPN' },
  { id: 'revenue-record', label: 'Revenue Record', status: 'pending', code: 'RVERR' },
  { id: 'lease-agreement', label: 'Lease Agreement', status: 'pending', code: 'LSAGM' },
  { id: 'death-certificate', label: 'Death Certificate', status: 'pending', code: 'DTCFT' },
  { id: 'partition-deed', label: 'Partition Deed', status: 'pending', code: 'PTNDD' },
  { id: 'encumbrance-certificate', label: 'Encumbrance Certificate', status: 'pending', code: 'EBCFT' },
  { id: 'land-coordinates', label: 'Land Coordinates', status: 'pending', code: 'LDCDN' },
  { id: 'owner-video-kyc', label: 'Owner Video KYC', status: 'pending', code: 'OWKYV' },
];

export const LegalDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const farmlandId = id || 'GLCSOS 01';

  const numericId = parseInt(farmlandId, 10);
  const apiId = isNaN(numericId) ? 1 : numericId;

  const { data: legalDocsStatus, isLoading, isError, refetch } = useGetFarmlandLegalDocsStatusQuery({
    farmlandId: apiId
  });

  const { downloadFile, isDownloading } = useFileDownload();
  const { data: masterDataObj } = useGetAllMasterDataQuery();
  const uploadMasterData = masterDataObj?.farmlandUploadResult || [];

  const mappedTabs = useMemo(() => {
    if (!legalDocsStatus?.data) {
      return BASE_TABS;
    }
    
    const backendData = legalDocsStatus.data;
    // Build map keyed by item.code (directly from API response)
    const backendCodeMap = new Map<string, { uploaded: boolean; isApproved: boolean; isRejected: boolean; revertReason: string | null }>();
    
    Object.values(backendData).forEach((item: any) => {
      const isApp = Number(item.is_super_admin_approved) === 1;
      const isRej = !isApp && !!item.revert_reason;
      if (item.code) {
        backendCodeMap.set(item.code, { uploaded: item.uploaded, isApproved: isApp, isRejected: isRej, revertReason: item.revert_reason ?? null });
      }
    });

    return BASE_TABS.map(tab => {
      const data = tab.code ? backendCodeMap.get(tab.code) : undefined;
      return {
        ...tab,
        isUploaded: data ? data.uploaded : false,
        status: data?.isRejected ? 'rejected' : (data?.isApproved ? 'approved' : 'pending'),
        revertReason: data?.revertReason
      };
    });
  }, [legalDocsStatus, uploadMasterData]);

  const [approveTab] = useApproveFarmlandTabMutation();
  const [revertTab] = useRevertFarmlandTabMutation();
  const user = useSelector(selectCurrentUser);
  const handleApproveTab = async (tabId: string) => {
    const doc = legalDocsStatus?.data ? Object.values(legalDocsStatus.data).find((item: any) => TAB_CODE_MAPPING[item.code] === tabId) as any : null;
    const version = doc?.versions?.[0];
    const uploadId = version?.farmland_upload_id || 0;
    
    try {
      await approveTab({ farmland_upload_id: uploadId }).unwrap();
      await refetch();
      return true;
    } catch (err) {
      console.error("Approve failed", err);
      return false;
    }
  };

  const handleRejectTab = async (tabId: string, reason: string) => {
    const doc = legalDocsStatus?.data ? Object.values(legalDocsStatus.data).find((item: any) => TAB_CODE_MAPPING[item.code] === tabId) as any : null;
    const version = doc?.versions?.[0];
    const code = doc?.code;
    const masterRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === code);
    const uploadId = version?.farmland_upload_id || 0;
    
    if (masterRecord) {
      try {
        const revertStatusRecord = masterDataObj?.revertStatus?.find((r: any) => r.code === "OPEN") || masterDataObj?.revertStatusResult?.find((r: any) => r.code === "OPEN");
        await revertTab({
          farmland_upload_id: uploadId,
          revert_reason: reason,
          version: version?.version || 1,
          master_revert_status_id: revertStatusRecord?.id || 1,
          userId: user?.id || 1
        }).unwrap();
        await refetch();
        return true;
      } catch (err) {
        console.error("Reject failed", err);
        return false;
      }
    }
    return true;
  };

  const {
    tabs,
    activeTabId,
    setActiveTabId,
    currentTab,
    showRejectModal,
    setShowRejectModal,
    handleApprove,
    handleRejectConfirm,
    isSubmitting,
  } = useVerificationFlow(mappedTabs, farmlandId, 'agriculture-report', {
    onApproveTab: handleApproveTab,
    onRejectTab: handleRejectTab
  });

  const activeDocumentData = useMemo(() => {
    if (!legalDocsStatus?.data) return null;
    
    return Object.values(legalDocsStatus.data).find((item: any) => 
      TAB_CODE_MAPPING[item.code] === activeTabId
    );
  }, [legalDocsStatus, activeTabId]);

  const activeVersion = (activeDocumentData as any)?.versions?.[0];
  const remarks = activeVersion?.remarks || '';
  const files = activeVersion?.files || [];
  const landCoordinatesUrl = activeVersion?.land_coordinates || '';


  return (
    <>
      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectConfirm}
        />
      )}

      {tabs.length > 0 && (
        <>
          <TabsCard tabs={tabs} activeTabId={activeTabId} onTabClick={setActiveTabId} />

          <div className="bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
            {/* ── Header ── */}
            <div className="px-6 py-6 shrink-0 border-b border-gray-100">
              <h2 className="text-black font-sans font-bold text-base md:text-lg m-0 leading-tight">
                {currentTab?.label || activeTabId}
              </h2>
              <p className="text-[#8C9088] font-sans text-xs md:text-sm m-0 mt-1">
                Review details and supporting documents for {currentTab?.label || activeTabId}.
              </p>
            </div>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3 text-gray-500 font-medium">Loading documents...</span>
              </div>
            ) : isError ? (
              <div className="flex-1 flex items-center justify-center text-red-500">
                Failed to load legal documents. Please try again.
              </div>
            ) : !activeVersion ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <span className="font-medium text-lg">No data available</span>
                <span className="text-sm">There are no records for this document yet.</span>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                  {/* Left Section - Conditional: Land Coordinates URL or Uploaded Files */}
                  <div className="flex flex-col min-w-0">
                  {activeTabId === 'land-coordinates' ? (
                    <>
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Land Coordinates</h3>
                      <div className="bg-[#F0F4F8] rounded-2xl p-4">
                        {landCoordinatesUrl ? (
                          <a 
                            href={landCoordinatesUrl}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[14px] text-[#1D7ABE] font-medium break-all hover:underline"
                          >
                            {landCoordinatesUrl}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No coordinates available</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Uploaded Files</h3>
                      <div className="flex flex-col gap-4">
                        {files.length > 0 ? (
                          files.map((file: any, index: number) => {
                            const originalFileName = file.document_url?.split('/').pop() || `Document ${index + 1}`;
                            return (
                              <FileRow 
                                key={file.id || index} 
                                file={{ id: String(file.id), name: originalFileName, size: '' }} 
                                onDownload={() => downloadFile(file.document_url, originalFileName)}
                                isDownloading={isDownloading}
                              />
                            );
                          })
                        ) : (
                          <div className="text-gray-400 text-sm py-4">No files uploaded for this document.</div>
                        )}
                      </div>
                    </>
                  )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <CommentsSection comment={remarks || "No remarks provided."} className="w-full h-[140px]" />
                  </div>
                </div>

                {/* ── Footer Navigation ── */}
                <div className="px-6 lg:px-10 py-4 lg:py-6 border-t border-gray-100 bg-white shrink-0">
                  <FooterActions
                    isApproved={currentTab?.status === 'approved'}
                    isRejected={currentTab?.status === 'rejected'}
                    revertReason={currentTab?.revertReason}
                    onReject={() => setShowRejectModal(true)}
                    onApprove={handleApprove}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
