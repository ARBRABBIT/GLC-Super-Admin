import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '../../core/api/baseApi';
import { superAdminService } from '@/features/super-admin/api/superAdminService';
import { masterDataService } from '@/features/super-admin/api/masterData.api';
import { farmlandService } from '@/features/super-admin/api/farmland.api';
import { fileService } from '@/features/super-admin/api/file.api';
import authReducer from '@/features/auth/store/authSlice';
import superAdminReducer from '@/features/super-admin/store/superAdminSlice';
import { landAndBoundariesService } from '@/features/super-admin/api/landAndBoundaries.api';
import { agricultureReportService } from '@/features/super-admin/api/agricultureReport.api';
import { customerService } from '@/features/super-admin/api/customer.api';
import { valuationService } from '@/features/super-admin/api/valuation.api';
import { farmlandActionService } from '@/features/super-admin/api/farmlandAction.api';
import { maintenanceService } from '@/features/super-admin/sub-features/maintenance/api/maintenanceServiceRequestApi';
import verificationReducer from '@/features/super-admin/sub-features/farmLandDocsverification/store/verificationSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [superAdminService.reducerPath]: superAdminService.reducer,
  [masterDataService.reducerPath]: masterDataService.reducer,
  [farmlandService.reducerPath]: farmlandService.reducer,
  [fileService.reducerPath]: fileService.reducer,
  [landAndBoundariesService.reducerPath]: landAndBoundariesService.reducer,
  [agricultureReportService.reducerPath]: agricultureReportService.reducer,
  [customerService.reducerPath]: customerService.reducer,
  [valuationService.reducerPath]: valuationService.reducer,
  [farmlandActionService.reducerPath]: farmlandActionService.reducer,
  [maintenanceService.reducerPath]: maintenanceService.reducer,
  verification: verificationReducer,
  auth: authReducer,
  superAdmin: superAdminReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
