import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';
import {
  useGetLocalIntelligenceStatusQuery,
  useGetFarmlandLegalDocsStatusQuery,
  useGetAgricultureReportStatusQuery,
  useGetLandAndBoundariesStatusQuery,
  useGetValuationStatusQuery,
  useGetFarmlandByIdQuery,
} from '@/features/super-admin/api/farmland.api';
import { useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useVerificationFlow } from '../hooks/useVerificationFlow';
import { TabsCard, CommentsSection, FooterActions } from '../components/SharedUI';
import { FileRow } from '../components/Icons';
import { DropdownField, InputTextField, RadioGroupField } from '../components/FormFields';
import { RejectModal } from '../components/Modals';
import { useFileDownload } from '@/features/super-admin/utils/useFileDownload';
import {
  useApproveFarmlandTabMutation,
  useRevertFarmlandTabMutation,
  useRevertFarmlandMutation,
  useSubmitFarmlandMutation,
} from '@/features/super-admin/api/farmlandAction.api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/store/authSlice';

// ─── Tab label maps for each section ────────────────────────────────────────

const LEGAL_DOCS_TAB_CODE_MAP: Record<string, string> = {
  LDDMT: 'Land Document',
  PTDPB: 'Pattadhar Passbook',
  LNDMT: 'Link Document',
  KSRPN: 'Kasara Pahani & Proceeding Copies',
  RVERR: 'Revenue Record',
  LSAGM: 'Lease Agreement',
  DTCFT: 'Death Certificate',
  PTNDD: 'Partition Deed',
  EBCFT: 'Encumbrance Certificate',
  LDCDN: 'Land Coordinates',
  OWKYV: 'Owner Video KYC',
};

const AGRICULTURE_TAB_CODE_MAP: Record<string, string> = {
  LAORP: 'Local Agriculture Officer Report',
  L5CYR: 'Last 5 years Crop Yielding Report',
  SOILS: 'Soil',
  TYCRP: 'Type Of Crop',
  GWLVL: 'Ground Water Level',
  TCCBG: 'Types of Crop can be grown',
  CURYD: 'Current Yield Cost',
  CURCL: 'Current Cultivation',
  FCRPS: 'Future Crops',
  MAINT: 'Maintenance',
  NATAD: 'Natural Advantages and Disadvantages',
};

const LAND_BOUNDARIES_TAB_CODE_MAP: Record<string, string> = {
  LNIMG: 'Land Images',
  LSVFW: 'Landscape View of Farmlands',
  SHPLD: 'Shape of the Land',
  WEFAC: 'Water and Electricity Facility',
  EXTRE: 'Any Existing Trees',
  MPLAN: 'Master Plan',
  EBOUN: 'East Boundaries',
  WBOUN: 'West Boundaries',
  NBOUN: 'North Boundaries',
  SBOUN: 'South Boundaries',
};

// Maps API description values → human-readable labels (mirrors getDocTypeDesc in Valuation.tsx)
const VALUATION_DESCRIPTION_TO_LABEL: Record<string, string> = {
  village_map_or_naksha: 'Village Map or Naksha',
  sub_registrar_value: 'Sub - Register Value',
  valuator_report: 'Valuator Report',
  legal_opinion_report: 'Legal Opinion Report',
  road_approach: 'Road Approach',
  recent_transaction: 'Recent Transactions',
  geological_advantages: 'Geological Advantages',
  future_plan: 'Future Plans',
  validating_disadvantages: 'Validating Disadvantages',
  upcoming_infrastructure: 'Upcoming Infrastructures',
  railway_truck_connectivity: 'Railway Track Connectivity',
  airport_connectivity: 'Airport Connectivity',
};


const LOCAL_INTELLIGENCE_CODE_MAP: Record<string, string> = {
  AYISS: 'Any Issues',
  LCLBT: 'Local Liabilities',
  APDLN: 'Any Pending Loans',
  ONMDT: 'Owner Mindset',
  SRPON: 'Source Person',
  AGEMT: 'Agreements',
  PVTNT: 'Previous Transactions',
};

// ─── Tab definitions ─────────────────────────────────────────────────────────

const LOCAL_INTELLIGENCE_TABS: DocumentTab[] = [
  { id: 'any-issues', label: 'Any Issues', status: 'pending', code: 'AYISS' },
  { id: 'local-liabilities', label: 'Local Liabilities', status: 'pending', code: 'LCLBT' },
  { id: 'any-pending-loans', label: 'Any Pending Loans', status: 'pending', code: 'APDLN' },
  { id: 'owner-mindset', label: 'Owner Mindset', status: 'pending', code: 'ONMDT' },
  { id: 'source-person', label: 'Source Person', status: 'pending', code: 'SRPON' },
  { id: 'agreements', label: 'Agreements', status: 'pending', code: 'AGEMT' },
  { id: 'previous-transactions', label: 'Previous Transactions', status: 'pending', code: 'PVTNT' },
];

// ─── Helper to extract rejected tab labels from a status API response ─────────

function extractRejectedLabels(
  data: any,
  codeToLabelMap: Record<string, string>,
  masterUploadResult?: any[]
): string[] {
  if (!data) return [];
  const rejected: string[] = [];

  Object.keys(data).forEach((idKey) => {
    const item = data[idKey];
    const isApproved = Number(item?.is_super_admin_approved) === 1;
    const hasRevertReason = !!item?.revert_reason;
    if (isApproved || !hasRevertReason) return;

    // Try code from item directly
    if (item.code && codeToLabelMap[item.code]) {
      rejected.push(codeToLabelMap[item.code]);
      return;
    }
    // Try resolving code via master data
    if (masterUploadResult) {
      const masterRecord = masterUploadResult.find((m: any) => String(m.id) === String(idKey));
      if (masterRecord?.code && codeToLabelMap[masterRecord.code]) {
        rejected.push(codeToLabelMap[masterRecord.code]);
      }
    }
  });

  return rejected;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const LocalIntelligence: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const farmlandId = id ?? 'GLCSOS 01';

  const numericId = parseInt(farmlandId, 10);
  const apiId = isNaN(numericId) ? 1 : numericId;

  const { data: masterDataObj } = useGetAllMasterDataQuery();
  const { data: localIntelligenceStatus, isLoading, isError, refetch } = useGetLocalIntelligenceStatusQuery({ farmlandId: apiId });
  const { data: farmlandDetails } = useGetFarmlandByIdQuery({ farmlandId: apiId });

  const { downloadFile, isDownloading } = useFileDownload();
  const [approveTab] = useApproveFarmlandTabMutation();
  const [revertTab] = useRevertFarmlandTabMutation();
  const [revertFarmland, { isLoading: isReverting }] = useRevertFarmlandMutation();
  const [submitFarmland] = useSubmitFarmlandMutation();
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const [showSummaryModal, setShowSummaryModal] = React.useState(false);
  const [summaryError, setSummaryError] = React.useState<string | null>(null);

  // ── Status queries (triggered only when summary modal opens) ────────────────
  const [skipSummaryQueries, setSkipSummaryQueries] = React.useState(true);

  const { data: legalDocsStatus, isLoading: legalLoading, isError: legalError, refetch: refetchLegal } =
    useGetFarmlandLegalDocsStatusQuery({ farmlandId: apiId }, { skip: skipSummaryQueries });
  const { data: agricultureStatus, isLoading: agricultureLoading, isError: agricultureError, refetch: refetchAgriculture } =
    useGetAgricultureReportStatusQuery({ farmlandId: apiId }, { skip: skipSummaryQueries });
  const { data: landBoundariesStatus, isLoading: landBoundariesLoading, isError: landBoundariesError, refetch: refetchLandBoundaries } =
    useGetLandAndBoundariesStatusQuery({ farmlandId: apiId }, { skip: skipSummaryQueries });
  const { data: valuationStatus, isLoading: valuationLoading, isError: valuationError, refetch: refetchValuation } =
    useGetValuationStatusQuery({ farmlandId: apiId }, { skip: skipSummaryQueries });
  const { data: localIntelligenceStatusForSummary, isLoading: liLoading, isError: liError, refetch: refetchLI } =
    useGetLocalIntelligenceStatusQuery({ farmlandId: apiId }, { skip: skipSummaryQueries });

  const isSummaryLoading = legalLoading || agricultureLoading || landBoundariesLoading || valuationLoading || liLoading;
  const hasSummaryError = legalError || agricultureError || landBoundariesError || valuationError || liError;

  // ── Compute rejected tab labels and reverted stage IDs from all status APIs ─

  const { rejectedTabLabels, revertedStageIds } = React.useMemo(() => {
    if (skipSummaryQueries || isSummaryLoading) return { rejectedTabLabels: [], revertedStageIds: [] };

    const masterUpload = masterDataObj?.farmlandUploadResult || [];
    const allRejected: string[] = [];
    const stageIds: number[] = [];

    // Helper: check if a flat data object has ANY unapproved AND reverted item
    const hasAnyRejection = (data: any): boolean => {
      if (!data) return false;
      return Object.values(data).some((item: any) => Number((item as any)?.is_super_admin_approved) !== 1 && !!(item as any)?.revert_reason);
    };

    // ── Legal Docs ────────────────────────────────────────────────────────────
    const legalRejected = extractRejectedLabels(legalDocsStatus?.data, LEGAL_DOCS_TAB_CODE_MAP, masterUpload);
    allRejected.push(...legalRejected);
    if (hasAnyRejection(legalDocsStatus?.data) && (legalDocsStatus as any)?.stage_id) {
      stageIds.push(Number((legalDocsStatus as any).stage_id));
    }

    // ── Agriculture Report ────────────────────────────────────────────────────
    const agriRejected = extractRejectedLabels(agricultureStatus?.data, AGRICULTURE_TAB_CODE_MAP, masterUpload);
    allRejected.push(...agriRejected);
    if (hasAnyRejection(agricultureStatus?.data) && agricultureStatus?.stage_id) {
      stageIds.push(Number(agricultureStatus.stage_id));
    }

    // ── Land Boundaries ───────────────────────────────────────────────────────
    const landRejected = extractRejectedLabels(landBoundariesStatus?.data, LAND_BOUNDARIES_TAB_CODE_MAP, masterUpload);
    allRejected.push(...landRejected);
    if (hasAnyRejection(landBoundariesStatus?.data) && landBoundariesStatus?.stage_id) {
      stageIds.push(Number(landBoundariesStatus.stage_id));
    }

    // ── Valuation ─────────────────────────────────────────────────────────────
    if (valuationStatus?.data) {
      let valuationHasRejection = false;
      Object.values(valuationStatus.data).forEach((item: any) => {
        const isApproved = Number(item?.is_super_admin_approved) === 1;
        const hasRevertReason = !!item?.revert_reason;
        if (isApproved || !hasRevertReason) return;
        valuationHasRejection = true;
        const label = item.description && VALUATION_DESCRIPTION_TO_LABEL[item.description];
        if (label) allRejected.push(label);
      });
      if (valuationHasRejection && valuationStatus?.stage_id) {
        stageIds.push(Number(valuationStatus.stage_id));
      }
    }

    // ── Local Intelligence ────────────────────────────────────────────────────
    if (localIntelligenceStatusForSummary?.data) {
      const liData = localIntelligenceStatusForSummary.data;
      let liHasRejection = false;
      Object.keys(liData).forEach((idKey) => {
        const item = (liData as any)[idKey];
        const isApproved = Number(item?.is_super_admin_approved) === 1;
        const hasRevertReason = !!item?.revert_reason;
        if (isApproved || !hasRevertReason) return;
        liHasRejection = true;
        const masterRecord = masterUpload.find((m: any) => String(m.id) === String(idKey));
        const label = masterRecord?.code && LOCAL_INTELLIGENCE_CODE_MAP[masterRecord.code];
        if (label) allRejected.push(label);
      });
      if (liHasRejection && localIntelligenceStatusForSummary?.stage_id) {
        stageIds.push(Number(localIntelligenceStatusForSummary.stage_id));
      }
    }

    return { rejectedTabLabels: allRejected, revertedStageIds: stageIds };
  }, [
    skipSummaryQueries, isSummaryLoading,
    legalDocsStatus, agricultureStatus, landBoundariesStatus, valuationStatus,
    localIntelligenceStatusForSummary, masterDataObj
  ]);

  const hasRejections = rejectedTabLabels.length > 0;

  // ── Mapped tabs for current verification flow ───────────────────────────────

  const mappedTabs = React.useMemo(() => {
    if (!localIntelligenceStatus?.data) {
      return LOCAL_INTELLIGENCE_TABS;
    }
    
    const backendData = localIntelligenceStatus.data;
    // Build map keyed by item.code (directly from API response)
    const backendCodeMap = new Map<string, { uploaded: boolean; isApproved: boolean; isRejected: boolean; revertReason: string | null }>();

    Object.keys(backendData).forEach((idKey) => {
      const item = (backendData as any)[idKey];
      const isApp = Number(item.is_super_admin_approved) === 1;
      const isRej = !isApp && !!item.revert_reason;

      if (item.code) {
        backendCodeMap.set(item.code, { uploaded: item.uploaded, isApproved: isApp, isRejected: isRej, revertReason: item.revert_reason ?? null });
      }
    });

    return LOCAL_INTELLIGENCE_TABS.map(tab => {
      const data = tab.code ? backendCodeMap.get(tab.code) : undefined;
      return {
        ...tab,
        isUploaded: data ? data.uploaded : false,
        status: data?.isRejected ? 'rejected' : (data?.isApproved ? 'approved' : 'pending'),
        revertReason: data?.revertReason
      };
    });
  }, [localIntelligenceStatus, masterDataObj]);

  // ── Approve / reject handlers ───────────────────────────────────────────────

  const handleApproveTab = async (tabId: string) => {
    const activeCode = LOCAL_INTELLIGENCE_TABS.find(t => t.id === tabId)?.code;
    const masterRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === activeCode);
    const doc = masterRecord && localIntelligenceStatus?.data ? (localIntelligenceStatus.data as any)[masterRecord.id] : null;
    const version = doc?.versions?.[0];
    const uploadId = version?.farmland_upload_id || 0;

    try {
      await approveTab({ farmland_upload_id: uploadId }).unwrap();
      await refetch();
      return true;
    } catch (err) {
      console.error('Approve failed', err);
      return false;
    }
  };

  const handleRejectTab = async (tabId: string, reason: string) => {
    const activeCode = LOCAL_INTELLIGENCE_TABS.find(t => t.id === tabId)?.code;
    const masterRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === activeCode);
    const doc = masterRecord && localIntelligenceStatus?.data ? (localIntelligenceStatus.data as any)[masterRecord.id] : null;
    const version = doc?.versions?.[0];
    const uploadId = version?.farmland_upload_id || 0;

    if (masterRecord) {
      try {
        const revertStatusRecord =
          masterDataObj?.revertStatus?.find((r: any) => r.code === 'OPEN') ||
          masterDataObj?.revertStatusResult?.find((r: any) => r.code === 'OPEN');
        await revertTab({
          farmland_upload_id: uploadId,
          revert_reason: reason,
          version: version?.version || 1,
          master_revert_status_id: revertStatusRecord?.id || 1,
          userId: user?.id || 1,
        }).unwrap();
        await refetch();
        return true;
      } catch (err) {
        console.error('Reject failed', err);
        return false;
      }
    }
    return true;
  };

  // ── Open summary modal: enable all status queries ──────────────────────────



  const retrySummaryQueries = () => {
    setSummaryError(null);
    refetchLegal();
    refetchAgriculture();
    refetchLandBoundaries();
    refetchValuation();
    refetchLI();
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
  } = useVerificationFlow(mappedTabs, farmlandId, null, {
    onApproveTab: handleApproveTab,
    onRejectTab: handleRejectTab,
  });

  // ── Final submit / revert handlers ─────────────────────────────────────────

  const handleRevert = async () => {
    setSummaryError(null);
    try {
      await revertFarmland({
        farmlandId: apiId,
        userId: user?.id || 1,
        revertedStages: revertedStageIds,
      }).unwrap();
      setShowSummaryModal(false);
      setSkipSummaryQueries(true);
    } catch (err) {
      console.error('Failed to revert farmland', err);
      setSummaryError('Failed to revert farmland. Please try again.');
    }
  };

  const handleSubmit = async () => {
    setSummaryError(null);
    try {
      const apprvdStatus = masterDataObj?.milestoneStageStatusResult?.find((s: any) => s.code === 'APPRVD');
      const sadminStage = masterDataObj?.milestoneStagesResult?.find((s: any) => s.code === 'SADMIN');
      await submitFarmland({
        farmlandId: apiId,
        master_milestone_stage_id: sadminStage?.id || 1,
        master_milestone_stage_status_id: apprvdStatus?.id || 1,
        userId: user?.id || 1,
        forSale: (farmlandDetails?.data?.is_verification_farmland ?? farmlandDetails?.is_verification_farmland) ? 0 : 1
      }).unwrap();
      setShowSummaryModal(false);
      setSkipSummaryQueries(true);
      navigate("/super-admin/assigned-farmlands");
    } catch (err) {
      console.error('Failed to submit farmland', err);
      setSummaryError('Failed to submit. Please try again.');
    }
  };

  // ── Active document data ────────────────────────────────────────────────────

  const activeDocumentData = React.useMemo(() => {
    if (!localIntelligenceStatus?.data || !masterDataObj?.farmlandUploadResult) return null;
    const activeCode = LOCAL_INTELLIGENCE_TABS.find(t => t.id === activeTabId)?.code;
    if (!activeCode) return null;
    const masterRecord = masterDataObj.farmlandUploadResult.find((m: any) => m.code === activeCode);
    if (!masterRecord) return null;
    return (localIntelligenceStatus.data as any)[masterRecord.id];
  }, [localIntelligenceStatus, masterDataObj, activeTabId]);

  const activeVersion = activeDocumentData?.versions?.[0];
  const remarks = activeVersion?.remarks || '';
  const files = activeVersion?.files || [];

  const FileListRender = () => (
    <>
      <h3 className="text-[22px] font-bold text-gray-900 mb-6">Uploaded Files</h3>
      <div className="flex flex-col gap-4 mb-8">
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
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Verification Summary Modal ────────────────────────────────────── */}
      {showSummaryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] shadow-[0px_8px_32px_rgba(0,0,0,0.18)] rounded-[24px] flex flex-col p-8 max-w-lg w-full mx-4">
            <h3 className="font-bold text-2xl text-gray-900 mb-2 text-center">Verification Summary</h3>
            <p className="text-gray-500 text-sm mb-6 text-center">Review the results across all verification steps.</p>

            {/* ── Loading ── */}
            {isSummaryLoading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-[#2A3125]" />
                <span className="text-gray-500 text-sm font-medium">Fetching verification status...</span>
              </div>
            )}

            {/* ── Error ── */}
            {!isSummaryLoading && hasSummaryError && (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-500 text-xl font-bold">!</span>
                </div>
                <p className="text-red-500 font-medium text-center">Failed to load verification status.</p>
                <button
                  onClick={retrySummaryQueries}
                  className="px-6 py-2 rounded-full border border-red-300 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ── Content ── */}
            {!isSummaryLoading && !hasSummaryError && (
              <>
                {hasRejections ? (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                        <span className="font-semibold text-gray-800 text-sm">
                          {rejectedTabLabels.length} tab{rejectedTabLabels.length !== 1 ? 's' : ''} not approved
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
                        {rejectedTabLabels.map((label) => (
                          <span
                            key={label}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs text-center mb-6">
                      Clicking <strong>Revert</strong> will revert this farmland for the above tabs.
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-8 gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-800 text-base">All tabs are approved!</p>
                    <p className="text-gray-500 text-sm text-center">You can now submit the farmland for final approval.</p>
                  </div>
                )}

                {/* ── API Error after submit/revert ── */}
                {summaryError && (
                  <p className="text-red-500 text-sm text-center mb-4">{summaryError}</p>
                )}

                <div className="flex gap-3 w-full justify-center">
                  <button
                    onClick={() => { setShowSummaryModal(false); setSkipSummaryQueries(true); }}
                    disabled={isReverting || isSubmitting}
                    className="flex-1 max-w-[160px] py-3 rounded-full border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Review Again
                  </button>

                  {hasRejections ? (
                    <button
                      onClick={handleRevert}
                      disabled={isReverting}
                      className="flex-1 max-w-[160px] py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isReverting ? 'Reverting...' : 'Revert'}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 max-w-[160px] py-3 rounded-full bg-[#2A3125] text-white font-bold hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                <span className="ml-3 text-gray-500 font-medium">Loading documents...</span>
              </div>
            ) : isError ? (
              <div className="flex-1 flex items-center justify-center text-red-500">
                Failed to load local intelligence reports. Please try again.
              </div>
            ) : !activeVersion ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <span className="font-medium text-lg">No data available</span>
                <span className="text-sm">There are no records for this document yet.</span>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                  <div className="flex flex-col min-w-0 gap-6">
                  {activeTabId === 'any-issues' ? (
                    <RadioGroupField
                      label="Any issues with Boundaries & Owners?"
                      options={[
                        { label: 'Available', selected: activeVersion.is_any_issues_available === 1 },
                        { label: 'Not Available', selected: activeVersion.is_any_issues_available === 0 },
                      ]}
                    />
                  ) : activeTabId === 'local-liabilities' ? (
                    <RadioGroupField
                      label="Any local Liabilities?"
                      options={[
                        { label: 'Available', selected: activeVersion.is_local_liabilities_available === 1 },
                        { label: 'Not Available', selected: activeVersion.is_local_liabilities_available === 0 },
                      ]}
                    />
                  ) : activeTabId === 'any-pending-loans' ? (
                    <>
                      <RadioGroupField
                        label="Any Bank Loans or Pending Loans on the Land?"
                        options={[
                          { label: 'Available', selected: activeVersion.is_bank_loans_available === 1 },
                          { label: 'Not Available', selected: activeVersion.is_bank_loans_available === 0 },
                        ]}
                      />
                      {activeVersion.is_bank_loans_available === 1 && (
                        <div className="mt-8">
                          <InputTextField label="Please Enter Loan Amount" value={activeVersion.loan_amount || ''} />
                        </div>
                      )}
                    </>
                  ) : activeTabId === 'owner-mindset' ? (
                    <DropdownField label="Owner Mindset" value={masterDataObj?.ownerMindsetResult?.find((m: any) => String(m.id) === String(activeVersion?.owner_mindset_id))?.description || 'Unknown'} />
                  ) : activeTabId === 'source-person' ? (
                    <>
                      <DropdownField label="Source Person" value={masterDataObj?.sourcePersonsResult?.find((m: any) => String(m.id) === String(activeVersion?.source_person_id))?.description || 'Unknown'} />
                      <div className="mt-8">
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Contact Details</h3>
                        <InputTextField label="Name" value={activeVersion.person_name || ''} />
                        <DropdownField label="Mobile" value={`${activeVersion.country_code || ''} ${activeVersion.mobile || ''}`.trim()} />
                      </div>
                    </>
                  ) : activeTabId === 'agreements' ? (
                    <>
                      <RadioGroupField
                        label="Any paper agreement on this land?"
                        options={[
                          { label: 'Available', selected: activeVersion.is_agreements_available === 1 },
                          { label: 'Not Available', selected: activeVersion.is_agreements_available === 0 },
                        ]}
                      />
                      {activeVersion.is_agreements_available === 1 && (
                        <div className="mt-8">
                          <RadioGroupField
                            label="Agreement type"
                            options={[
                              { label: 'Legal', selected: activeVersion.is_legal_agreement === 1 },
                              { label: 'Verbal', selected: activeVersion.is_verbal_agreement === 1 },
                            ]}
                          />
                          <div className="mt-8">
                            <InputTextField label="Last Price of the land when made agreement?" value={activeVersion.agreement_price || ''} />
                          </div>
                          <div className="mt-8">
                            <FileListRender />
                          </div>
                        </div>
                      )}
                    </>
                  ) : activeTabId === 'previous-transactions' ? (
                    <>
                      <RadioGroupField
                        label="Any previous transactions?"
                        options={[
                          { label: 'Available', selected: activeVersion.is_previous_transactions_available === 1 },
                          { label: 'Not Available', selected: activeVersion.is_previous_transactions_available === 0 },
                        ]}
                      />
                      {activeVersion.is_previous_transactions_available === 1 && (
                        <div className="mt-8">
                          <InputTextField label="Last transaction price of the Document" value={activeVersion.last_transaction_price || ''} />
                          <div className="mt-8">
                            <FileListRender />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <FileListRender />
                  )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <CommentsSection comment={remarks || 'No remarks provided.'} className="w-full h-[140px]" />
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
