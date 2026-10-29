import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';

export const useVerificationFlow = (
  initialTabs: DocumentTab[],
  farmlandId: string,
  nextStepRoutePath: string | null,
  callbacks?: {
    onApproveTab?: (tabId: string) => Promise<boolean>;
    onRejectTab?: (tabId: string, reason: string) => Promise<boolean>;
    onFinish?: () => void;
  }
) => {
  const navigate = useNavigate();
  // We use initialTabs directly as tabs to ensure the state strictly matches the RTK Query backend data.
  const tabs = initialTabs;
  
  const tabsRef = useRef(initialTabs);
  useEffect(() => {
    tabsRef.current = initialTabs;
  }, [initialTabs]);
  
  const [activeTabId, setActiveTabId] = useState(initialTabs[0]?.id || '');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTabId);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      if (callbacks?.onApproveTab) {
        const success = await callbacks.onApproveTab(activeTabId);
        if (!success) return;
      }
      
      setActiveTabId((currentActiveTabId) => {
        const currentTabs = tabsRef.current;
        const currentIndex = currentTabs.findIndex((t) => t.id === currentActiveTabId);
        
        // Just go to the next tab linearly
        if (currentIndex >= 0 && currentIndex < currentTabs.length - 1) {
          return currentTabs[currentIndex + 1].id;
        }
        
        return currentActiveTabId;
      });

      setTimeout(() => {
        if (callbacks?.onFinish) {
          const currentTabs = tabsRef.current;
          const currentIndex = currentTabs.findIndex((t) => t.id === activeTabId);
          if (currentIndex === currentTabs.length - 1) {
            callbacks.onFinish();
          }
        }

        const currentSearchParams = new URLSearchParams(window.location.search);
        currentSearchParams.set('checkAllDone', 'true');
        navigate(`${window.location.pathname}?${currentSearchParams.toString()}`, { replace: true });
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    setIsSubmitting(true);
    try {
      if (callbacks?.onRejectTab) {
        const success = await callbacks.onRejectTab(activeTabId, reason);
        if (!success) return;
      }
      
      console.log("Document rejected with reason:", reason);
      setShowRejectModal(false);

      setActiveTabId((currentActiveTabId) => {
        const currentTabs = tabsRef.current;
        const currentIndex = currentTabs.findIndex((t) => t.id === currentActiveTabId);
        
        if (currentIndex >= 0 && currentIndex < currentTabs.length - 1) {
          return currentTabs[currentIndex + 1].id;
        }
        return currentActiveTabId;
      });

      setTimeout(() => {
        const currentTabs = tabsRef.current;
        const currentIndex = currentTabs.findIndex((t) => t.id === activeTabId);
        
        if (currentIndex === currentTabs.length - 1) {
          if (callbacks?.onFinish) {
            callbacks.onFinish();
          } else if (!nextStepRoutePath) {
            navigate('/super-admin/assigned-farmlands');
          } else {
            navigate(`/super-admin/assigned-farmlands/${farmlandId}/${nextStepRoutePath}?checkAllDone=true`);
          }
        } else {
          const currentSearchParams = new URLSearchParams(window.location.search);
          currentSearchParams.set('checkAllDone', 'true');
          navigate(`${window.location.pathname}?${currentSearchParams.toString()}`, { replace: true });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tabs,
    activeTabId,
    setActiveTabId,
    currentTab,
    showRejectModal,
    setShowRejectModal,
    handleApprove,
    handleRejectConfirm,
    isSubmitting,
  };
};
