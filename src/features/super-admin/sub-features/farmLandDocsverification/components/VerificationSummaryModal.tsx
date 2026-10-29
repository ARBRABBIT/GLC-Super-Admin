import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/store/authSlice';
import {
  useGetFarmlandLegalDocsStatusQuery,
  useGetAgricultureReportStatusQuery,
  useGetLandAndBoundariesStatusQuery,
  useGetValuationStatusQuery,
  useGetLocalIntelligenceStatusQuery,
  useGetFarmlandByIdQuery
} from '@/features/super-admin/api/farmland.api';
import {
  useRevertFarmlandMutation,
  useSubmitFarmlandMutation
} from '@/features/super-admin/api/farmlandAction.api';
import { useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import {
  LEGAL_DOCS_TAB_CODE_MAP,
  AGRICULTURE_TAB_CODE_MAP,
  LAND_BOUNDARIES_TAB_CODE_MAP,
  VALUATION_DESCRIPTION_TO_LABEL,
  LOCAL_INTELLIGENCE_CODE_MAP
} from '../constants/tabMappings';

const extractRejectedLabels = (data: any, map: Record<string, string>, masterUpload: any[]): string[] => {
  if (!data) return [];
  const rejected: string[] = [];
  Object.keys(data).forEach((idKey) => {
    const item = data[idKey];
    const isApproved = Number(item?.is_super_admin_approved) === 1;
    const hasRevertReason = !!item?.revert_reason;
    if (isApproved || !hasRevertReason) return;
    
    let label: string | null | undefined = null;
    const masterRecord = masterUpload.find((m: any) => String(m.id) === String(idKey));
    if (masterRecord?.code) label = map[masterRecord.code];
    if (!label && item?.code) label = map[item.code];
    if (!label && item?.description) {
      label = String(item.description).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
    
    if (label) rejected.push(label);
  });
  return rejected;
};

export const VerificationSummaryModal: React.FC<{
  farmlandId: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ farmlandId, isOpen, onClose }) => {
  const numericId = parseInt(farmlandId, 10);
  const apiId = isNaN(numericId) ? 1 : numericId;
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const { data: masterDataObj } = useGetAllMasterDataQuery(undefined, { skip: !isOpen });
  const { data: farmlandDetails } = useGetFarmlandByIdQuery({ farmlandId: apiId }, { skip: !isOpen });

  const [revertFarmland, { isLoading: isReverting }] = useRevertFarmlandMutation();
  const [submitFarmland, { isLoading: isSubmitting }] = useSubmitFarmlandMutation();
  const [summaryError, setSummaryError] = React.useState<string | null>(null);

  const { data: legalDocsStatus, isLoading: legalLoading, isError: legalError, refetch: refetchLegal } =
    useGetFarmlandLegalDocsStatusQuery({ farmlandId: apiId }, { skip: !isOpen });
  const { data: agricultureStatus, isLoading: agricultureLoading, isError: agricultureError, refetch: refetchAgriculture } =
    useGetAgricultureReportStatusQuery({ farmlandId: apiId }, { skip: !isOpen });
  const { data: landBoundariesStatus, isLoading: landBoundariesLoading, isError: landBoundariesError, refetch: refetchLandBoundaries } =
    useGetLandAndBoundariesStatusQuery({ farmlandId: apiId }, { skip: !isOpen });
  const { data: valuationStatus, isLoading: valuationLoading, isError: valuationError, refetch: refetchValuation } =
    useGetValuationStatusQuery({ farmlandId: apiId }, { skip: !isOpen });
  const { data: localIntelligenceStatusForSummary, isLoading: liLoading, isError: liError, refetch: refetchLI } =
    useGetLocalIntelligenceStatusQuery({ farmlandId: apiId }, { skip: !isOpen });

  const isSummaryLoading = legalLoading || agricultureLoading || landBoundariesLoading || valuationLoading || liLoading;
  const hasSummaryError = legalError || agricultureError || landBoundariesError || valuationError || liError;

  const { rejectedTabLabels, revertedStageIds, totalPending } = React.useMemo(() => {
    if (!isOpen || isSummaryLoading) return { rejectedTabLabels: [], revertedStageIds: [], totalPending: 0 };

    const masterUpload = masterDataObj?.farmlandUploadResult || [];
    const allRejected: string[] = [];
    const stageIds: number[] = [];
    let pendingCount = 0;

    const countPending = (data: any) => {
      if (!data) return 0;
      return Object.values(data).filter((item: any) => 
        (item as any)?.uploaded === true &&
        Number((item as any)?.is_super_admin_approved) !== 1 && 
        !((item as any)?.revert_reason)
      ).length;
    };

    const hasAnyRejection = (data: any): boolean => {
      if (!data) return false;
      return Object.values(data).some((item: any) => Number((item as any)?.is_super_admin_approved) !== 1 && !!((item as any)?.revert_reason));
    };

    const legalRejected = extractRejectedLabels(legalDocsStatus?.data, LEGAL_DOCS_TAB_CODE_MAP, masterUpload);
    allRejected.push(...legalRejected);
    if (hasAnyRejection(legalDocsStatus?.data) && (legalDocsStatus as any)?.stage_id) {
      stageIds.push(Number((legalDocsStatus as any).stage_id));
    }
    pendingCount += countPending(legalDocsStatus?.data);

    const agriRejected = extractRejectedLabels(agricultureStatus?.data, AGRICULTURE_TAB_CODE_MAP, masterUpload);
    allRejected.push(...agriRejected);
    if (hasAnyRejection(agricultureStatus?.data) && agricultureStatus?.stage_id) {
      stageIds.push(Number(agricultureStatus.stage_id));
    }
    pendingCount += countPending(agricultureStatus?.data);

    const landRejected = extractRejectedLabels(landBoundariesStatus?.data, LAND_BOUNDARIES_TAB_CODE_MAP, masterUpload);
    allRejected.push(...landRejected);
    if (hasAnyRejection(landBoundariesStatus?.data) && landBoundariesStatus?.stage_id) {
      stageIds.push(Number(landBoundariesStatus.stage_id));
    }
    pendingCount += countPending(landBoundariesStatus?.data);

    if (valuationStatus?.data) {
      let valuationHasRejection = false;
      Object.values(valuationStatus.data).forEach((item: any) => {
        if (item?.uploaded !== true) return;
        const isApproved = Number(item?.is_super_admin_approved) === 1;
        const hasRevertReason = !!item?.revert_reason;
        if (!isApproved && !hasRevertReason) pendingCount++;
        if (isApproved || !hasRevertReason) return;
        valuationHasRejection = true;
        
        let label = item.description ? VALUATION_DESCRIPTION_TO_LABEL[item.description] : null;
        if (!label && item.code) label = VALUATION_DESCRIPTION_TO_LABEL[item.code];
        if (!label && item.description) {
          label = String(item.description).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        }
        
        if (label) allRejected.push(label);
      });
      if (valuationHasRejection && valuationStatus?.stage_id) {
        stageIds.push(Number(valuationStatus.stage_id));
      }
    }

    if (localIntelligenceStatusForSummary?.data) {
      const liData = localIntelligenceStatusForSummary.data;
      let liHasRejection = false;
      Object.keys(liData).forEach((idKey) => {
        const item = (liData as any)[idKey];
        if (item?.uploaded !== true) return;
        const isApproved = Number(item?.is_super_admin_approved) === 1;
        const hasRevertReason = !!item?.revert_reason;
        if (!isApproved && !hasRevertReason) pendingCount++;
        if (isApproved || !hasRevertReason) return;
        liHasRejection = true;
        
        let label: string | null | undefined = null;
        const masterRecord = masterUpload.find((m: any) => String(m.id) === String(idKey));
        if (masterRecord?.code) label = LOCAL_INTELLIGENCE_CODE_MAP[masterRecord.code];
        if (!label && item?.code) label = LOCAL_INTELLIGENCE_CODE_MAP[item.code];
        if (!label && item?.description) {
          label = String(item.description).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        }
        
        if (label) allRejected.push(label);
      });
      if (liHasRejection && localIntelligenceStatusForSummary?.stage_id) {
        stageIds.push(Number(localIntelligenceStatusForSummary.stage_id));
      }
    }
    console.log(pendingCount,"insideSummary")
    return { rejectedTabLabels: allRejected, revertedStageIds: stageIds, totalPending: pendingCount };
  }, [
    isOpen, isSummaryLoading,
    legalDocsStatus, agricultureStatus, landBoundariesStatus, valuationStatus,
    localIntelligenceStatusForSummary, masterDataObj, farmlandId
  ]);

  const hasRejections = rejectedTabLabels.length > 0;

  const retrySummaryQueries = () => {
    setSummaryError(null);
    refetchLegal();
    refetchAgriculture();
    refetchLandBoundaries();
    refetchValuation();
    refetchLI();
  };

  const handleRevert = async () => {
    setSummaryError(null);
    try {
      await revertFarmland({
        farmlandId: apiId,
        userId: user?.id || 1,
        revertedStages: revertedStageIds,
      }).unwrap();
      onClose();
      navigate("/super-admin/assigned-farmlands");
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
      onClose();
      navigate("/super-admin/assigned-farmlands");
    } catch (err) {
      console.error('Failed to submit farmland', err);
      setSummaryError('Failed to submit. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[110] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[rgba(0,0,0,0.1)] shadow-[0px_8px_32px_rgba(0,0,0,0.18)] rounded-[24px] flex flex-col p-8 max-w-lg w-full mx-4">
        <h3 className="font-bold text-2xl text-gray-900 mb-2 text-center">Verification Summary</h3>
        <p className="text-gray-500 text-sm mb-6 text-center">Review the results across all verification steps.</p>

        {isSummaryLoading && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-[#2A3125]" />
            <span className="text-gray-500 text-sm font-medium">Fetching verification status...</span>
          </div>
        )}

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

        {!isSummaryLoading && !hasSummaryError && (
          <>
            {totalPending > 0 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                 <span className="text-yellow-800 text-sm font-semibold">{totalPending} tab(s) are still pending verification across all steps.</span>
              </div>
            )}
            
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
                    {rejectedTabLabels.map((label: string) => (
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

                {summaryError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                    {summaryError}
                  </div>
                )}

                <div className="flex gap-3 w-full justify-center">
                  <button
                    onClick={onClose}
                    disabled={isReverting || isSubmitting}
                    className="flex-1 max-w-[160px] py-3 rounded-full border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Review Again
                  </button>

                  <button
                    onClick={handleRevert}
                    disabled={isReverting || isSubmitting || totalPending > 0}
                    className={`flex-1 max-w-[160px] py-3 rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      isReverting || totalPending > 0
                        ? 'bg-red-200 text-red-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
                    }`}
                  >
                    {isReverting && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Revert
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-6 gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow-[0_0_0_8px_rgba(220,252,231,0.5)]">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900">All Steps Approved!</h4>
                    <p className="text-gray-500 text-sm mt-1">Ready to complete the verification process.</p>
                  </div>
                </div>

                {summaryError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                    {summaryError}
                  </div>
                )}

                <div className="flex gap-3 w-full justify-center">
                  <button
                    onClick={onClose}
                    disabled={isReverting || isSubmitting}
                    className="flex-1 max-w-[160px] py-3 rounded-full border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Review Again
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isReverting || isSubmitting || totalPending > 0}
                    className={`flex-1 max-w-[160px] py-3 rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      isSubmitting || totalPending > 0
                        ? 'bg-[#E1E8B0] text-[#2B3024] opacity-50 cursor-not-allowed'
                        : 'bg-[#E1E8B0] text-[#2B3024] hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-[#2B3024]/30 border-t-[#2B3024] rounded-full animate-spin" />
                    )}
                    Submit
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
