import { lazy } from "react";

// Super Admin
export const SuperAdminDashboard = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminDashboard"));
export const SuperAdminLogin = lazy(() => import ("@/features/super-admin/sub-features/users/pages/SuperAdminLogin"));
export const SuperAdminFarmlands = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlands"));
export const SuperAdminFarmlandsListPreview = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListPreview"));
export const SuperAdminFarmlandsListFull = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandsListFull"));
export const SuperAdminDraftFarmlands = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminDraftFarmlands"));
export const SuperAdminUsersListFull = lazy(() => import ("@/features/super-admin/sub-features/users/pages/SuperAdminUsersListFull"));
export const SuperAdminUsersListAll = lazy(() => import ("@/features/super-admin/sub-features/users/pages/SuperAdminUsersListAll"));
export const SuperAdminEditFarmlandTag = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminEditFarmlandTag"));
export const SuperAdminAssignedFarmlandsList = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandsList"));
export const SuperAdminAssignedFarmlandDetails = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminAssignedFarmlandDetails"));
// SuperAdminCustomerInformation moved to farmLandDocsverification
export const SuperAdminUserProfile = lazy(() => import ("@/features/super-admin/sub-features/users/pages/SuperAdminUserProfile"));
export const SuperAdminTopPerformers = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminTopPerformers"));
export const SuperAdminFarmlandDetails = lazy(() => import ("@/features/super-admin/sub-features/dashboard/pages/SuperAdminFarmlandDetails"));
export const SuperAdminAgentProfile = lazy(() => import ("@/features/super-admin/sub-features/users/pages/SuperAdminAgentProfile"));
export const SuperAdminProfile = lazy(() => import ("@/features/super-admin/sub-features/users/pages/SuperAdminProfile"));

export const SuperAdminPoolBuying = lazy(() => import ("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuying"));
export const SuperAdminPoolSelectLocation = lazy(() => import ("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolSelectLocation"));
export const SuperAdminPoolCreate = lazy(() => import ("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreate"));
export const SuperAdminPoolBuyingAll = lazy(() => import("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolBuyingAll"));
export const SuperAdminPoolDetails = lazy(() => import ("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolDetails"));
export const SuperAdminPoolInvestorDetails = lazy(() => import ("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolInvestorDetails"));
export const SuperAdminPoolPublished = lazy(() => import("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolPublished"));
export const SuperAdminPoolCreated = lazy(() => import("@/features/super-admin/sub-features/pool/pages/SuperAdminPoolCreated"));

export const FarmLandDocsVerificationRoot = lazy(() => import('@/features/super-admin/sub-features/farmLandDocsverification/index').then(m => ({ default: m.FarmLandDocsVerificationRoot })));
export const SuperAdminCustomerInformation = lazy(() => import('@/features/super-admin/sub-features/farmLandDocsverification/pages/CustomerInformation').then(m => ({ default: m.CustomerInformation })));
export const SuperAdminLegalDocuments = lazy(() => import('@/features/super-admin/sub-features/farmLandDocsverification/pages/LegalDocuments').then(m => ({ default: m.LegalDocuments })));
export const SuperAdminAgricultureReport = lazy(() => import('@/features/super-admin/sub-features/farmLandDocsverification/pages/AgricultureReport').then(m => ({ default: m.AgricultureReport })));
export const SuperAdminLandBoundaries = lazy(() => import('@/features/super-admin/sub-features/farmLandDocsverification/pages/LandBoundaries').then(m => ({ default: m.LandBoundaries })));
export const SuperAdminValuation = lazy(() => import('@/features/super-admin/sub-features/farmLandDocsverification/pages/Valuation').then(m => ({ default: m.Valuation })));
export const SuperAdminLocalIntelligence = lazy(() => import('@/features/super-admin/sub-features/farmLandDocsverification/pages/LocalIntelligence').then(m => ({ default: m.LocalIntelligence })));

export const UploadSuperAdmin = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/UploadSuperAdmin'));
export const SuperAdminUploadLandDetails = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadLandDetails'));
export const SuperAdminUploadViewMaps = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadViewMaps'));
export const SuperAdminUploadCustomerInformation = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/SuperAdminUploadCustomerInformation'));

export const UploadDocsRoot = lazy(() => import('@/features/super-admin/sub-features/upload-docs/index').then(m => ({ default: m.UploadDocsRoot })));
export const UploadLegalDocuments = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/UploadLegalDocuments').then(m => ({ default: m.UploadLegalDocuments })));
export const UploadAgricultureReport = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/UploadAgricultureReport').then(m => ({ default: m.UploadAgricultureReport })));
export const UploadLandBoundaries = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/UploadLandBoundaries').then(m => ({ default: m.UploadLandBoundaries })));
export const UploadValuation = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/UploadValuation').then(m => ({ default: m.UploadValuation })));
export const UploadLocalIntelligence = lazy(() => import('@/features/super-admin/sub-features/upload-docs/pages/UploadLocalIntelligence').then(m => ({ default: m.UploadLocalIntelligence })));

// Maintenance
export const MaintenanceDashboard = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceDashboard'));
export const MaintenanceLogin = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceLogin'));
export const MaintenanceServiceRequests = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceServiceRequests'));
export const MaintenanceVerifyRequest = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceVerifyRequest'));
export const MaintenanceQuotationDetails = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceQuotationDetails'));
export const MaintenanceCustomerResponseDetails = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceCustomerResponseDetails'));
export const MaintenanceWorkOrders = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceWorkOrders'));
export const MaintenanceProfile = lazy(() => import('@/features/super-admin/sub-features/maintenance/pages/MaintenanceProfile'));
