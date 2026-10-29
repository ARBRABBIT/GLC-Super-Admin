import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../../core/api/baseApi';
import { superAdminService } from '@/features/super-admin/api/superAdminService';
import { masterDataService } from '@/features/super-admin/api/masterData.api';
import { farmlandService } from '@/features/super-admin/api/farmland.api';
import { fileService } from '@/features/super-admin/api/file.api';
import { rtkQueryErrorLogger } from '../../core/api/errorMiddleware';
import rootReducer from './rootReducer';
import { landAndBoundariesService } from '@/features/super-admin/api/landAndBoundaries.api';
import { agricultureReportService } from '@/features/super-admin/api/agricultureReport.api';
import { customerService } from '@/features/super-admin/api/customer.api';
import { valuationService } from '@/features/super-admin/api/valuation.api';
import { farmlandActionService } from '@/features/super-admin/api/farmlandAction.api';
import { maintenanceService } from '@/features/super-admin/sub-features/maintenance/api/maintenanceServiceRequestApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      baseApi.middleware,
      superAdminService.middleware,
      masterDataService.middleware,
      farmlandService.middleware,
      fileService.middleware,
      landAndBoundariesService.middleware,
      agricultureReportService.middleware,
      customerService.middleware,
      valuationService.middleware,
      farmlandActionService.middleware,
      maintenanceService.middleware,
      rtkQueryErrorLogger
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type { RootState } from './rootReducer';
