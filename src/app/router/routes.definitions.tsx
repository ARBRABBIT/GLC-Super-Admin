import type {RouteObject} from 'react-router-dom';
import {RootLayout} from '@/components/common/layouts/RootLayout';
import {DashboardRedirect} from './DashboardRedirect';
import {
    SuperAdminDashboard,
    SuperAdminLogin,
    SuperAdminFarmlands,
    UploadSuperAdmin,
    SuperAdminAssignedFarmlandsList,
    SuperAdminFarmlandsListPreview,
    SuperAdminFarmlandsListFull,
    SuperAdminDraftFarmlands,
    SuperAdminUsersListFull,
    SuperAdminUsersListAll,
    SuperAdminAssignedFarmlandDetails,
    SuperAdminCustomerInformation,
    SuperAdminEditFarmlandTag,
    SuperAdminUserProfile,
    SuperAdminTopPerformers,
    SuperAdminFarmlandDetails,
    SuperAdminAgentProfile,
    SuperAdminProfile,
    SuperAdminPoolBuying,
    SuperAdminPoolSelectLocation,
    SuperAdminPoolBuyingAll,
    SuperAdminPoolCreate,
    SuperAdminPoolCreated,
    SuperAdminPoolPublished,
    SuperAdminPoolDetails,
    SuperAdminPoolInvestorDetails,
    SuperAdminLegalDocuments,
    SuperAdminAgricultureReport,
    SuperAdminLandBoundaries,
    SuperAdminValuation,
    SuperAdminLocalIntelligence,
    FarmLandDocsVerificationRoot,
    SuperAdminUploadLandDetails,
    SuperAdminUploadViewMaps,
    SuperAdminUploadCustomerInformation,
    UploadDocsRoot,
    UploadLegalDocuments,
    UploadAgricultureReport,
    UploadLandBoundaries,
    UploadValuation,
    UploadLocalIntelligence,
    MaintenanceDashboard,
    MaintenanceLogin,
    MaintenanceServiceRequests,
    MaintenanceVerifyRequest,
    MaintenanceQuotationDetails,
    MaintenanceCustomerResponseDetails,
    MaintenanceWorkOrders,
    MaintenanceProfile,
} from './routes.config';

export const guestRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <SuperAdminLogin />
    }, {
        path: '/super-admin/login',
        element: <SuperAdminLogin />
    }, {
        path: '/maintenance/login',
        element: <MaintenanceLogin />
    }, {
        path: '/super-admin/maintenance/login',
        element: <MaintenanceLogin />
    }
];

export const authRoutes: RouteObject[] = [
    {
        path: '/maintenance/dashboard',
        element: <MaintenanceDashboard />
    },
    {
        path: '/super-admin/maintenance/dashboard',
        element: <MaintenanceDashboard />
    },
    {
        path: '/maintenance/service-requests',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/super-admin/maintenance/service-requests',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/service-requests/new-requests',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/super-admin/maintenance/service-requests/new-requests',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/service-requests/quotations',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/super-admin/maintenance/service-requests/quotations',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/service-requests/customer-response',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/super-admin/maintenance/service-requests/customer-response',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/service-requests/verify/:id',
        element: <MaintenanceVerifyRequest />
    },
    {
        path: '/super-admin/maintenance/service-requests/verify/:id',
        element: <MaintenanceVerifyRequest />
    },
    {
        path: '/maintenance/service-requests/quotation/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/super-admin/maintenance/service-requests/quotation/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/service-requests/quotations/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/super-admin/maintenance/service-requests/quotations/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/service-requests/customer-response/:id',
        element: <MaintenanceCustomerResponseDetails />
    },
    {
        path: '/super-admin/maintenance/service-requests/customer-response/:id',
        element: <MaintenanceCustomerResponseDetails />
    },
    {
        path: '/maintenance/customer-response/:id',
        element: <MaintenanceCustomerResponseDetails />
    },
    {
        path: '/super-admin/maintenance/customer-response/:id',
        element: <MaintenanceCustomerResponseDetails />
    },
    {
        path: '/maintenance/quotation/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/super-admin/maintenance/quotation/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/quotations/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/super-admin/maintenance/quotations/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/work-orders',
        element: <MaintenanceWorkOrders />
    },
    {
        path: '/super-admin/maintenance/work-orders',
        element: <MaintenanceWorkOrders />
    },
    {
        path: '/maintenance/work-orders/:id',
        element: <MaintenanceWorkOrders />
    },
    {
        path: '/super-admin/maintenance/work-orders/:id',
        element: <MaintenanceWorkOrders />
    },
    {
        path: '/maintenance/profile',
        element: <MaintenanceProfile />
    },
    {
        path: '/super-admin/maintenance/profile',
        element: <MaintenanceProfile />
    },
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <DashboardRedirect />
            },
            {
                path: '/super-admin/dashboard',
                element: <SuperAdminDashboard />
            }, {
                path: '/super-admin/upload',
                element: <UploadSuperAdmin />
            }, {
                path: '/super-admin/farmlands',
                element: <SuperAdminFarmlands />
            }, {
                path: '/super-admin/assigned-farmlands',
                element: <SuperAdminAssignedFarmlandsList />
            }, {
                path: '/super-admin/farmlands-list',
                element: <SuperAdminFarmlandsListPreview />
            }, {
                path: '/super-admin/draft-farmlands',
                element: <SuperAdminDraftFarmlands />
            }, {
                path: '/super-admin/farmlands-list/all',
                element: <SuperAdminFarmlandsListFull />
            }, {
                path: '/super-admin/users-list',
                element: <SuperAdminUsersListFull />
            }, {
                path: '/super-admin/users-list/all',
                element: <SuperAdminUsersListAll />
            }, {
                path: '/super-admin/edit-farmland-tag/:id',
                element: <SuperAdminEditFarmlandTag />
            }, {
                path: '/super-admin/assigned-farmlands/:id',
                element: <SuperAdminAssignedFarmlandDetails />
            }, {
                path: '/super-admin/upload/land-details/:id',
                element: <SuperAdminUploadLandDetails />
            }, {
                path: '/super-admin/upload/view-maps/:id',
                element: <SuperAdminUploadViewMaps />
            }, {
                path: '/super-admin/upload/process/:id',
                element: <UploadDocsRoot />,
                children: [
                    { path: 'customer-information', element: <SuperAdminUploadCustomerInformation /> },
                    { path: 'legal-documents', element: <UploadLegalDocuments /> },
                    { path: 'agriculture-report', element: <UploadAgricultureReport /> },
                    { path: 'land-boundaries', element: <UploadLandBoundaries /> },
                    { path: 'valuation', element: <UploadValuation /> },
                    { path: 'local-intelligence', element: <UploadLocalIntelligence /> }
                ]
            }, {
                path: '/super-admin/user-profile/:id',
                element: <SuperAdminUserProfile />
            }, {
                path: '/super-admin/top-performers',
                element: <SuperAdminTopPerformers />
            }, {
                path: '/super-admin/farmlands-list/:id',
                element: <SuperAdminFarmlandDetails />
            }, {
                path: '/super-admin/agent-profile/:id',
                element: <SuperAdminAgentProfile />
            }, {
                path: '/super-admin/profile',
                element: <SuperAdminProfile />
            }, {
                path: '/super-admin/pool-buying',
                element: <SuperAdminPoolBuying />
            }, {
                path: '/super-admin/pool-buying/select-location',
                element: <SuperAdminPoolSelectLocation />
            }, {
                path: '/super-admin/pool-buying/create',
                element: <SuperAdminPoolCreate />
            }, {
                path: '/super-admin/pool-buying/created',
                element: <SuperAdminPoolCreated />
            }, {
                path: '/super-admin/pool-buying/published',
                element: <SuperAdminPoolPublished />
            }, {
                path: '/super-admin/pool-buying/all',
                element: <SuperAdminPoolBuyingAll />
            }, {
                path: '/super-admin/pool-buying/:id',
                element: <SuperAdminPoolDetails />
            }, {
                path: '/super-admin/pool-buying/:id/investor/:investorId',
                element: <SuperAdminPoolInvestorDetails />
            }
        ]
    },
    {
        path: '/super-admin/assigned-farmlands/:id',
        element: <FarmLandDocsVerificationRoot />,
        children: [
            {
                path: 'customer-information',
                element: <SuperAdminCustomerInformation />
            },
            {
                path: 'legal-documents',
                element: <SuperAdminLegalDocuments />
            },
            {
                path: 'agriculture-report',
                element: <SuperAdminAgricultureReport />
            },
            {
                path: 'land-boundaries',
                element: <SuperAdminLandBoundaries />
            },
            {
                path: 'valuation',
                element: <SuperAdminValuation />
            },
            {
                path: 'local-intelligence',
                element: <SuperAdminLocalIntelligence />
            }
        ]
    }
];

export const publicRoutes: RouteObject[] = [
    {
        path: '/maintenance/preview/dashboard',
        element: <MaintenanceDashboard />
    },
    {
        path: '/maintenance/preview/service-requests',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/preview/service-requests/new-requests',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/preview/service-requests/quotations',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/preview/service-requests/customer-response',
        element: <MaintenanceServiceRequests />
    },
    {
        path: '/maintenance/preview/service-requests/verify/:id',
        element: <MaintenanceVerifyRequest />
    },
    {
        path: '/maintenance/preview/service-requests/quotation/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/preview/service-requests/quotations/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/preview/service-requests/customer-response/:id',
        element: <MaintenanceCustomerResponseDetails />
    },
    {
        path: '/maintenance/preview/customer-response/:id',
        element: <MaintenanceCustomerResponseDetails />
    },
    {
        path: '/maintenance/preview/quotation/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/preview/quotations/:id',
        element: <MaintenanceQuotationDetails />
    },
    {
        path: '/maintenance/preview/work-orders',
        element: <MaintenanceWorkOrders />
    },
    {
        path: '/maintenance/preview/work-orders/:id',
        element: <MaintenanceWorkOrders />
    },
    {
        path: '/maintenance/preview/profile',
        element: <MaintenanceProfile />
    }
];
