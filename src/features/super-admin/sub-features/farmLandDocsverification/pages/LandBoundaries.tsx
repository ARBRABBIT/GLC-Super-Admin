import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';
import { useGetLandAndBoundariesStatusQuery, useGetFarmlandByIdQuery } from '@/features/super-admin/api/farmland.api';
import { useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useVerificationFlow } from '../hooks/useVerificationFlow';
import { TabsCard, CommentsSection, FooterActions } from '../components/SharedUI';
import { FileRow } from '../components/Icons';
import { DropdownField, InputTextField, RadioGroupField } from '../components/FormFields';
import { RejectModal } from '../components/Modals';
import { useFileDownload } from '@/features/super-admin/utils/useFileDownload';
import { useApproveFarmlandTabMutation, useRevertFarmlandTabMutation } from '@/features/super-admin/api/farmlandAction.api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/store/authSlice';

const LAND_BOUNDARIES_TABS: DocumentTab[] = [
  { id: 'land-images', label: 'Land Images', status: 'pending', code: 'LNIMG' },
  { id: 'landscape-view', label: 'Landscape View of Farmlands', status: 'pending', code: 'LSVFW' },
  { id: 'shape-land', label: 'Shape of the Land', status: 'pending', code: 'SHPLD' },
  { id: 'water-electricity', label: 'Water and Electricity Facility', status: 'pending', code: 'WEFAC' },
  { id: 'existing-trees', label: 'Any Existing Trees', status: 'pending', code: 'EXTRE' },
  { id: 'master-plan', label: 'Master Plan', status: 'pending', code: 'MPLAN' },
  { id: 'survey-report', label: 'Survey Report', status: 'pending', code: 'SURVEY_COMBINED' }, // Custom handling
  { id: 'east-boundaries', label: 'East Boundaries', status: 'pending', code: 'EBOUN' },
  { id: 'west-boundaries', label: 'West Boundaries', status: 'pending', code: 'WBOUN' },
  { id: 'north-boundaries', label: 'North Boundaries', status: 'pending', code: 'NBOUN' },
  { id: 'south-boundaries', label: 'South Boundaries', status: 'pending', code: 'SBOUN' },
];

export const LandBoundaries: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const farmlandId = id ?? 'GLCSOS 01';

  const numericId = parseInt(farmlandId, 10);
  const apiId = isNaN(numericId) ? 1 : numericId;

  const { data: masterDataObj } = useGetAllMasterDataQuery();
  const { data: landBoundariesStatus, isLoading, isError, refetch } = useGetLandAndBoundariesStatusQuery({
    farmlandId: apiId
  });
  const { data: farmlandDetails } = useGetFarmlandByIdQuery({ farmlandId: apiId });

  const { downloadFile, isDownloading } = useFileDownload();

  const mappedTabs = useMemo(() => {
    if (!landBoundariesStatus?.data) {
      return LAND_BOUNDARIES_TABS;
    }
    
    const backendData = landBoundariesStatus.data;
    // Build map keyed by item.code (directly from API response)
    const backendCodeMap = new Map<string, { uploaded: boolean; isApproved: boolean; isRejected: boolean; revertReason: string | null }>();

    Object.keys(backendData).forEach((idKey) => {
      const item = (backendData as any)[idKey];
      const isApp = Number(item.is_super_admin_approved) === 1;
      const isRej = !isApp && !!item.revert_reason;

      if (item.code) {
        backendCodeMap.set(item.code, {
          uploaded: item.uploaded,
          isApproved: isApp,
          isRejected: isRej,
          revertReason: item.revert_reason ?? null
        });
      }
    });

    return LAND_BOUNDARIES_TABS.map(tab => {
      let isUploaded = false;
      let isApproved = false;
      let isRejected = false;
      let revertReason: string | null | undefined = undefined;
      
      if (tab.id === 'survey-report') {
        // survey-report combines two codes: PVSVR (private) and GVSVR (govt)
        const pvt = backendCodeMap.get('PVSVR');
        const govt = backendCodeMap.get('GVSVR');
        isUploaded = !!(pvt?.uploaded || govt?.uploaded);
        isApproved = !!(pvt?.isApproved || govt?.isApproved);
        isRejected = !!(pvt?.isRejected || govt?.isRejected);
        revertReason = pvt?.revertReason || govt?.revertReason;
      } else {
        const data = tab.code ? backendCodeMap.get(tab.code) : undefined;
        if (data) {
          isUploaded = data.uploaded;
          isApproved = data.isApproved;
          isRejected = data.isRejected;
          revertReason = data.revertReason;
        }
      }
      return { 
        ...tab, 
        isUploaded, 
        status: isRejected ? 'rejected' : (isApproved ? 'approved' : 'pending'),
        revertReason
      };
    });
  }, [landBoundariesStatus]);

  const [approveTab] = useApproveFarmlandTabMutation();
  const [revertTab] = useRevertFarmlandTabMutation();
  const user = useSelector(selectCurrentUser);

  const handleApproveTab = async (tabId: string) => {
    if (tabId === 'survey-report') {
      const pvtRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === 'PVSVR');
      const govtRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === 'GVSVR');
      const pvtDoc = pvtRecord && landBoundariesStatus?.data ? (landBoundariesStatus.data as any)[pvtRecord.id] : null;
      const govtDoc = govtRecord && landBoundariesStatus?.data ? (landBoundariesStatus.data as any)[govtRecord.id] : null;
      
      const promises = [];
      if (pvtDoc && pvtDoc.versions?.[0]) {
        promises.push(approveTab({ farmland_upload_id: pvtDoc.versions[0].farmland_upload_id }).unwrap());
      }
      if (govtDoc && govtDoc.versions?.[0]) {
        promises.push(approveTab({ farmland_upload_id: govtDoc.versions[0].farmland_upload_id }).unwrap());
      }
      
      if (promises.length > 0) {
        try {
          await Promise.all(promises);
          await refetch();
          return true;
        } catch (err) {
          console.error("Approve failed for survey report", err);
          return false;
        }
      }
      return true;
    }

    const activeCode = LAND_BOUNDARIES_TABS.find(t => t.id === tabId)?.code;
    const masterRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === activeCode);
    const doc = masterRecord && landBoundariesStatus?.data ? (landBoundariesStatus.data as any)[masterRecord.id] : null;
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
    if (tabId === 'survey-report') {
      const pvtRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === 'PVSVR');
      const govtRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === 'GVSVR');
      const pvtDoc = pvtRecord && landBoundariesStatus?.data ? (landBoundariesStatus.data as any)[pvtRecord.id] : null;
      const govtDoc = govtRecord && landBoundariesStatus?.data ? (landBoundariesStatus.data as any)[govtRecord.id] : null;
      
      const revertStatusRecord = masterDataObj?.revertStatus?.find((r: any) => r.code === "OPEN") || masterDataObj?.revertStatusResult?.find((r: any) => r.code === "OPEN");
      const master_revert_status_id = revertStatusRecord?.id || 1;

      const promises = [];
      if (pvtDoc && pvtDoc.versions?.[0]) {
        promises.push(revertTab({
          farmland_upload_id: pvtDoc.versions[0].farmland_upload_id,
          revert_reason: reason,
          version: pvtDoc.versions[0].version || 1,
          master_revert_status_id,
          userId: user?.id || 1
        }).unwrap());
      }
      if (govtDoc && govtDoc.versions?.[0]) {
        promises.push(revertTab({
          farmland_upload_id: govtDoc.versions[0].farmland_upload_id,
          revert_reason: reason,
          version: govtDoc.versions[0].version || 1,
          master_revert_status_id,
          userId: user?.id || 1
        }).unwrap());
      }
      
      if (promises.length > 0) {
        try {
          await Promise.all(promises);
          await refetch();
          return true;
        } catch (err) {
          console.error("Reject failed for survey report", err);
          return false;
        }
      }
      return true;
    }

    const activeCode = LAND_BOUNDARIES_TABS.find(t => t.id === tabId)?.code;
    const masterRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === activeCode);
    const doc = masterRecord && landBoundariesStatus?.data ? (landBoundariesStatus.data as any)[masterRecord.id] : null;
    const version = doc?.versions?.[0];
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
  } = useVerificationFlow(mappedTabs, farmlandId, 'valuation', {
    onApproveTab: handleApproveTab,
    onRejectTab: handleRejectTab
  });

  const activeDocumentData = React.useMemo(() => {
    if (!landBoundariesStatus?.data || !masterDataObj?.farmlandUploadResult) return null;
    
    if (activeTabId === 'survey-report') {
      // Return a combined object for Survey Report
      const pvtRecord = masterDataObj.farmlandUploadResult.find((m: any) => m.code === 'PVSVR');
      const govtRecord = masterDataObj.farmlandUploadResult.find((m: any) => m.code === 'GVSVR');
      return {
        isSurveyReportCombined: true,
        privateSurvey: pvtRecord ? (landBoundariesStatus.data as any)[pvtRecord.id] : null,
        governmentSurvey: govtRecord ? (landBoundariesStatus.data as any)[govtRecord.id] : null,
      };
    }

    const activeCode = LAND_BOUNDARIES_TABS.find(t => t.id === activeTabId)?.code;
    if (!activeCode) return null;

    const masterRecord = masterDataObj.farmlandUploadResult.find((m: any) => m.code === activeCode);
    if (!masterRecord) return null;

    return (landBoundariesStatus.data as any)[masterRecord.id];
  }, [landBoundariesStatus, masterDataObj, activeTabId]);

  const activeVersion = activeDocumentData?.isSurveyReportCombined 
    ? null 
    : activeDocumentData?.versions?.[0];
  
  const remarks = activeDocumentData?.isSurveyReportCombined 
    ? (activeDocumentData.privateSurvey?.versions?.[0]?.remarks || activeDocumentData.governmentSurvey?.versions?.[0]?.remarks || '')
    : (activeVersion?.remarks || '');
    
  const files = activeVersion?.files || [];

  const FileListRender = ({ customFiles }: { customFiles?: any[] }) => {
    const renderFiles = customFiles || files;
    return (
      <>
        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Uploaded Files</h3>
        <div className="flex flex-col gap-4 mb-8">
          {renderFiles.length > 0 ? (
            renderFiles.map((file: any, index: number) => {
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
    );
  };

  React.useEffect(() => {
    console.log("Land & Boundaries Status Response:", landBoundariesStatus);
  }, [landBoundariesStatus]);

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
                Failed to load land and boundaries reports. Please try again.
              </div>
            ) : (!activeDocumentData || (!activeVersion && !activeDocumentData.isSurveyReportCombined)) ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <span className="font-medium text-lg">No data available</span>
                <span className="text-sm">There are no records for this document yet.</span>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                  <div className="flex flex-col min-w-0 gap-6">
                  
                  {activeTabId === 'shape-land' ? (
                    <DropdownField 
                      label="Shape of the Land" 
                      value={
                        masterDataObj?.shapeOfTheLandResult?.find(
                          (m: any) => String(m.id) === String(activeVersion?.shape_of_land_id)
                        )?.description || 'Unknown'
                      } 
                    />

                  ) : activeTabId === 'existing-trees' ? (
                    <>
                      <RadioGroupField 
                        label="Any Existing Trees?" 
                        options={[
                          { label: 'Yes', selected: activeVersion?.is_any_existing_trees === 1 },
                          { label: 'No', selected: activeVersion?.is_any_existing_trees === 0 }
                        ]} 
                      />
                      {activeVersion?.is_any_existing_trees === 1 && (
                        <div className="mt-8">
                          <DropdownField 
                            label="Number of trees" 
                            value={
                              masterDataObj?.treesCountResult?.find(
                                (m: any) => String(m.id) === String(activeVersion?.trees_count_id)
                              )?.description || 'Unknown'
                            } 
                          />
                        </div>
                      )}
                    </>

                  ) : activeTabId === 'water-electricity' ? (
                    <>
                      <RadioGroupField 
                        label="Select availability Facility" 
                        options={[
                          { label: 'Water Facility', selected: activeVersion?.is_water_availability === 1 && activeVersion?.is_electricity_availability === 0 },
                          { label: 'Electricity Facility', selected: activeVersion?.is_electricity_availability === 1 && activeVersion?.is_water_availability === 0 },
                          { label: 'Both', selected: activeVersion?.is_water_availability === 1 && activeVersion?.is_electricity_availability === 1 }
                        ]} 
                      />
                      <div className="mt-8">
                        <RadioGroupField 
                          label="Select Water Facility" 
                          options={[
                            { label: 'Bore', selected: activeVersion?.is_bore === 1 },
                            { label: 'Muncipal', selected: activeVersion?.is_municipal === 1 }
                          ]} 
                        />
                      </div>
                      <div className="mt-8">
                        <RadioGroupField 
                          label="Select Electricity Facility" 
                          options={[
                            { label: '2 Phase', selected: activeVersion?.is_2phase === 1 },
                            { label: '3 Phase', selected: activeVersion?.is_3phase === 1 }
                          ]} 
                        />
                      </div>
                    </>

                  ) : activeTabId === 'survey-report' ? (
                    <>
                      <RadioGroupField 
                        label="Select Survey Report Type" 
                        options={[
                          { label: 'Private Survey Report', selected: activeDocumentData.privateSurvey?.uploaded === true && activeDocumentData.governmentSurvey?.uploaded !== true },
                          { label: 'Government Survey Report', selected: activeDocumentData.governmentSurvey?.uploaded === true && activeDocumentData.privateSurvey?.uploaded !== true },
                          { label: 'Both Survey Reports', selected: activeDocumentData.privateSurvey?.uploaded === true && activeDocumentData.governmentSurvey?.uploaded === true }
                        ]} 
                      />
                      
                      {activeDocumentData.privateSurvey?.uploaded === true && (
                        <div className="mt-8">
                          <h3 className="text-[20px] font-bold text-gray-900 mb-4">Private Survey Report</h3>
                          <FileListRender customFiles={activeDocumentData.privateSurvey?.versions?.[0]?.files || []} />
                        </div>
                      )}
                      
                      {activeDocumentData.governmentSurvey?.uploaded === true && (
                        <div className="mt-8">
                          <h3 className="text-[20px] font-bold text-gray-900 mb-4">Government Survey Report</h3>
                          <FileListRender customFiles={activeDocumentData.governmentSurvey?.versions?.[0]?.files || []} />
                        </div>
                      )}
                    </>

                  ) : activeTabId.includes('-boundaries') ? (
                    <>
                      <DropdownField 
                        label={activeTabId.split('-')[0].charAt(0).toUpperCase() + activeTabId.split('-')[0].slice(1) + ' Boundaries'} 
                        value={
                          masterDataObj?.boundariesResult?.find(
                            (m: any) => String(m.id) === String(activeVersion?.boundary_id)
                          )?.description || 'Unknown'
                        } 
                      />
                      
                      <div className="mt-8">
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Land Owner Details</h3>
                        <InputTextField label="Name" value={activeVersion?.owner_name || ''} />
                        <InputTextField label="Age" value={activeVersion?.owner_age || ''} />
                      </div>
                    </>

                  ) : activeTabId === 'land-images' ? (
                    <div className="flex flex-col gap-6 w-full">
                      <div className="flex flex-col gap-3 w-full">
                        <span className="font-sans font-bold text-[18px] text-black">Cover image</span>
                        {farmlandDetails?.data?.cover_image_url ? (
                          <div className="relative w-full shrink-0 h-[72px] bg-[#EEF5FA] rounded-[12px] flex flex-row items-center px-4 gap-4">
                            <div className="flex items-center justify-center bg-white w-[42px] h-[42px] rounded-[8px] shrink-0 border border-gray-100 shadow-sm relative">
                              <img src={farmlandDetails.data.cover_image_url} alt="Cover" className="w-full h-full object-cover rounded-[8px]" />
                            </div>
                            <div className="flex flex-col justify-center flex-1 min-w-0">
                              <span className="truncate text-black font-sans font-medium text-[15px] leading-[20px] block" title={farmlandDetails.data.cover_image_url.split('/').pop() || 'Cover Image'}>
                                {farmlandDetails.data.cover_image_url.split('/').pop() || 'Cover Image'}
                              </span>
                              <span className="font-sans font-medium text-[12px] text-gray-500 mt-1">-</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => downloadFile(farmlandDetails.data.cover_image_url, 'cover_image')} className="flex items-center justify-center bg-transparent cursor-pointer hover:bg-gray-200 rounded p-1.5 transition-colors border-none" title="Download">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm py-2">No cover image uploaded.</div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 w-full mt-4">
                        <span className="font-sans font-bold text-[18px] text-black">Land images</span>
                        <FileListRender customFiles={files} />
                      </div>
                    </div>
                  ) : (
                    <FileListRender customFiles={files} />
                  )}
                  </div>

                {activeTabId === 'survey-report' && activeDocumentData?.isSurveyReportCombined ? (
                  <div className="flex flex-col gap-6 w-full">
                    {activeDocumentData.privateSurvey?.uploaded === true && (
                      <div className="flex flex-col min-w-0">
                        <CommentsSection 
                          title="Comments (Private Survey Report)" 
                          comment={activeDocumentData.privateSurvey?.versions?.[0]?.remarks || "No remarks provided."} 
                          className="w-full h-[140px]" 
                        />
                      </div>
                    )}
                    {activeDocumentData.governmentSurvey?.uploaded === true && (
                      <div className="flex flex-col min-w-0">
                        <CommentsSection 
                          title="Comments (Government Survey Report)" 
                          comment={activeDocumentData.governmentSurvey?.versions?.[0]?.remarks || "No remarks provided."} 
                          className="w-full h-[140px]" 
                        />
                      </div>
                    )}
                    {activeDocumentData.privateSurvey?.uploaded !== true && activeDocumentData.governmentSurvey?.uploaded !== true && (
                      <div className="flex flex-col min-w-0">
                        <CommentsSection comment="No remarks provided." className="w-full h-[140px]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col min-w-0">
                    <CommentsSection comment={remarks || "No remarks provided."} className="w-full h-[140px]" />
                  </div>
                )}
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
