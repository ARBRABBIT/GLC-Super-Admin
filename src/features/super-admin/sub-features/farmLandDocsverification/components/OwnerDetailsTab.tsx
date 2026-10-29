import React from 'react';

export const OwnerDetailsTab: React.FC<{ ownerDetailsData: any, isLoading?: boolean }> = ({ ownerDetailsData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-500 font-medium">Loading owner details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-6">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm text-gray-700">First Name</label>
          <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
            <span className="text-gray-900 font-medium break-all">{ownerDetailsData?.data?.first_name || '-'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm text-gray-700">Last Name</label>
          <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
            <span className="text-gray-900 font-medium break-all">{ownerDetailsData?.data?.last_name || '-'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm text-gray-700">Email</label>
          <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
            <span className="text-gray-900 font-medium break-all">{ownerDetailsData?.data?.email || '-'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm text-gray-700">Phone Number</label>
          <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
            <span className="text-gray-900 font-medium break-all">
              {ownerDetailsData?.data?.phone || '-'}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm text-gray-700">Date of Birth</label>
          <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
            <span className="text-gray-900 font-medium break-all">{ownerDetailsData?.data?.dob ? ownerDetailsData.data.dob.split('T')[0] : '-'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm text-gray-700">Gender</label>
          <div className="min-h-[48px] bg-white border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center justify-between break-words">
            <span className="text-gray-900 font-medium break-all">{ownerDetailsData?.data?.gender || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
