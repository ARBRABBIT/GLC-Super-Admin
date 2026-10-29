import React, { useEffect, useState } from 'react';
import { Outlet, useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, StepperSidebar } from './components/SharedUI';
import { VerificationSummaryModal } from './components/VerificationSummaryModal';
import {
  useGetFarmlandLegalDocsStatusQuery,
  useGetAgricultureReportStatusQuery,
  useGetLandAndBoundariesStatusQuery,
  useGetValuationStatusQuery,
  useGetLocalIntelligenceStatusQuery,
} from '@/features/super-admin/api/farmland.api';

/** Returns true if every uploaded item in the status data object has been actioned
 *  (approved OR reverted). A "pending" item has is_super_admin_approved=0 and revert_reason=null.
 */
function hasNoPendingItems(payload: any): boolean {
  if (!payload) return true; // no data yet → treat as "not all done"
  
  // The API often returns { success: true, data: { "66": {...} } }
  // We need to iterate over the inner `data` object if it exists.
  const tabsObj = payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data) ? payload.data : payload;

  // Filter for only uploaded items. If a tab is not uploaded, super admin can't act on it.
  const uploadedItems = Object.values(tabsObj).filter(
    (item: any) => (item as any)?.uploaded === true
  );
  
  if (uploadedItems.length === 0) return true; // nothing uploaded = nothing to review
  
  return uploadedItems.every(
    (item: any) =>
      Number((item as any)?.is_super_admin_approved) === 1 ||
      !!((item as any)?.revert_reason)
  );
}

export const FarmLandDocsVerificationRoot: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const farmlandId = id || 'GLCSOS 01';
  const numericId = parseInt(farmlandId, 10);
  const apiId = isNaN(numericId) ? 1 : numericId;

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // ── Always-on status queries across all steps ──────────────────────────────
  // These run continuously so we can detect when all tabs are actioned.
  const { refetch: refetchLegal } = useGetFarmlandLegalDocsStatusQuery({ farmlandId: apiId });
  const { refetch: refetchAgri } = useGetAgricultureReportStatusQuery({ farmlandId: apiId });
  const { refetch: refetchLand } = useGetLandAndBoundariesStatusQuery({ farmlandId: apiId });
  const { refetch: refetchValuation } = useGetValuationStatusQuery({ farmlandId: apiId });
  const { refetch: refetchLI } = useGetLocalIntelligenceStatusQuery({ farmlandId: apiId });

  // ── Explicit trigger to refetch and check completion when a tab is actioned ────
  useEffect(() => {
    if (searchParams.get('checkAllDone') === 'true') {
      const checkCompletion = async () => {
        // Refetch all 5 APIs to get the latest status
        const [legal, agri, land, val, li] = await Promise.all([
          refetchLegal(),
          refetchAgri(),
          refetchLand(),
          refetchValuation(),
          refetchLI()
        ]);
        
        // Clean up URL without triggering a re-render loop
        const params = new URLSearchParams(searchParams);
        params.delete('checkAllDone');
        navigate({
          pathname: location.pathname,
          search: params.toString()
        }, { replace: true });

        // Evaluate if all uploaded tabs across all 5 steps have been actioned
        const allDone =
          hasNoPendingItems(legal.data) &&
          hasNoPendingItems(agri.data) &&
          hasNoPendingItems(land.data) &&
          hasNoPendingItems(val.data) &&
          hasNoPendingItems(li.data);

        // ONLY trigger the modal if it's explicitly the end of the action
        if (allDone) {
          setIsSummaryOpen(true);
        }
      };
      
      checkCompletion();
    }
  }, [searchParams, location.pathname, navigate, refetchLegal, refetchAgri, refetchLand, refetchValuation, refetchLI]);

  // ── Existing: open via ?openSummary=true URL param ─────────────────────────
  useEffect(() => {
    if (searchParams.get('openSummary') === 'true') {
      setIsSummaryOpen(true);
      
      // Clean up URL without triggering a re-render loop
      const params = new URLSearchParams(searchParams);
      params.delete('openSummary');
      navigate({
        pathname: location.pathname,
        search: params.toString()
      }, { replace: true });
    }
  }, [searchParams, location.pathname, navigate]);

  return (
    <div className="h-screen overflow-hidden bg-[#F2F2F2] font-sans flex flex-col">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-10 pt-8 pb-4 shrink-0 w-full">
        <PageHeader />
      </div>

      {/* Main 3-column layout */}
      <div className="flex items-stretch gap-5 px-10 pb-10 flex-1 min-h-0">
        {/* Column 1: Short Timeline Sidebar */}
        <StepperSidebar farmlandId={farmlandId} />

        {/* Columns 2+3: Outlet renders TabsCard + FilesDocument */}
        <div className="flex-1 min-w-0 min-h-0 h-full flex flex-row gap-5 relative">
          <Outlet />
        </div>
      </div>

      <VerificationSummaryModal
        farmlandId={farmlandId}
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />
    </div>
  );
};
