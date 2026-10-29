import type { UploadedFile, FlowStep } from '@/features/super-admin/types/legal-docs';

// ─── Sidebar Stepper Steps ────────────────────────────────────────────────────

export const FLOW_STEPS: FlowStep[] = [
  { id: 'customer-information', name: 'CUSTOMER INFORMATION', routePath: 'customer-information' },
  { id: 'legal-documents', name: 'LEGAL DOCUMENTS', routePath: 'legal-documents' },
  { id: 'agriculture-report', name: 'AGRICULTURE REPORT', routePath: 'agriculture-report' },
  { id: 'land-boundaries', name: 'LAND & BOUNDARIES', routePath: 'land-boundaries' },
  { id: 'valuation', name: 'VALUATION', routePath: 'valuation' },
  { id: 'local-intelligence', name: 'LOCAL INTELLIGENCE', routePath: 'local-intelligence' },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_FILES: UploadedFile[] = [
  { id: '1', name: 'File_name_1.pdf', size: '8MB' },
  { id: '2', name: 'File_name_1.pdf', size: '8MB' },
];

export const MOCK_COMMENT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
do eiusmod. Lorem ipsum dolor sit amet, consectetur
adipiscing elit.do eiusmod. Lorem ipsum dolor sit amet,
consectetur adipiscing elit. Lorem ipsum dolor sit amet,
consectetur.`;
