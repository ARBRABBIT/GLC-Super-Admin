import React from 'react';
import { Download } from 'lucide-react';
import type { UploadedFile } from '@/features/super-admin/types/legal-docs';

// ─── PDF Icon ─────────────────────────────────────────────────────────────────

export const PdfIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#FEE2E2" />
    <path d="M7 7h10v10H7V7z" fill="#fff" />
    <text x="8" y="16" fontSize="8" fill="#EF4444" fontWeight="bold" fontFamily="sans-serif">PDF</text>
  </svg>
);

// ─── Warning (Pending) Icon ───────────────────────────────────────────────────

export const WarningIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#F59E0B" />
    <path d="M8 5v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="11.5" r="0.9" fill="#fff" />
  </svg>
);

// ─── Rejected (Reverted) Icon ─────────────────────────────────────────────────

export const RejectedIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#EF4444" />
    <path d="M8 4.5v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.9" fill="#fff" />
  </svg>
);

// ─── Pending Dot (Not Visited) Icon ──────────────────────────────────────────

export const PendingDotIcon: React.FC = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <circle cx="5" cy="5" r="4" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
  </svg>
);

// ─── Check (Approved) Icon ────────────────────────────────────────────────────

export const CheckIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#fff" stroke="#8CB43A" strokeWidth="1.5" />
    <path d="M4.5 8L6.83 10.33 11.5 5.67" stroke="#8CB43A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Chevron Down Icon ────────────────────────────────────────────────────────

export const ChevronDownIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── File Row ─────────────────────────────────────────────────────────────────

export const FileRow: React.FC<{ file: UploadedFile, onDownload?: () => void, isDownloading?: boolean }> = ({ file, onDownload, isDownloading }) => (
  <div className="relative w-full shrink-0 h-[60px] bg-[#F6F9E2] rounded-[12px] mb-2 flex items-center justify-between px-3 box-border">
    <div className="flex items-center gap-3 w-[70%]">
      <div className="flex items-center justify-center bg-white w-9 h-9 rounded-[4px] shrink-0">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path d="M12 2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 9H5v-1h6v1zm0-2H5V8h6v1zm0-2H5V6h6v1z" fill="#BDD327"/>
        </svg>
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <span className="truncate text-black font-['Inter',_sans-serif] font-normal text-[14px] leading-tight block">
          {file.name}
        </span>
        <span className="font-['Inter',_sans-serif] font-normal text-[10px] text-[rgba(0,0,0,0.7)] mt-0.5">
          {file.size || '0 KB'}
        </span>
      </div>
    </div>

    <button 
      onClick={onDownload}
      disabled={isDownloading}
      className="flex items-center justify-center bg-white cursor-pointer hover:bg-gray-50 rounded-[4px] transition-colors w-8 h-8 shrink-0 disabled:opacity-50"
    >
      {isDownloading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#BDD327]"></div>
      ) : (
        <Download size={18} className="text-[rgba(0,0,0,0.82)]" />
      )}
    </button>
  </div>
);
