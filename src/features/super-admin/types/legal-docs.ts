// ─── Shared Types for Verification Flows ─────────────────────────────────────

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface DocumentTab {
  id: string;
  label: string;
  status: DocumentStatus | string;
  code?: string;
  isUploaded?: boolean;
  revertReason?: string | null;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

export interface FlowStep {
  id: string;
  name: string;
  routePath: string;
}
