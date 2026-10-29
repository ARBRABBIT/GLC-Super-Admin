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

export const FileRow: React.FC<{ file: UploadedFile }> = ({ file }) => (
  <div className="flex items-center gap-4 bg-[#F0F4F8] rounded-2xl p-4 transition-colors hover:bg-[#e6ebf1]">
    <PdfIcon />
    <div className="flex-1 flex flex-col">
      <span className="text-[14px] font-bold text-gray-900 leading-tight">{file.name}</span>
      <span className="text-[12px] font-medium text-gray-400 mt-0.5">{file.size}</span>
    </div>
    <button className="p-2 hover:bg-white rounded-full transition-colors">
      <Download size={20} className="text-gray-600" />
    </button>
  </div>
);
