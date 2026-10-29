import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// Using inline mock data that matches the exact screenshot for "Sold Out" table
const soldOutData = [
  {
    id: "1",
    farmlandId: "GLCSOS 01",
    agent: "Rajesh Kumar",
    location: "West Godaveri, Tanuku",
    price: "₹25 Lakhs",
    acres: 100,
    pricePerAcre: "₹10,000",
    status: "Sold to Application",
    statusColor: "text-[#16A34A]",
    statusBg: "bg-[#16A34A]",
    buyerName: "Krishna Reddy",
    buyerType: "Application Customer",
    buyerTypeColor: "text-[#3B82F6]",
    assignedDate: "12 October 2025 • 10:30 AM",
    soldDate: "14 November 2025 • 2:15 PM"
  },
  {
    id: "2",
    farmlandId: "GLCSOS 01",
    agent: "Rajesh Kumar",
    location: "West Godaveri, Tanuku",
    price: "₹85 Lakhs",
    acres: 210,
    pricePerAcre: "₹12,000",
    status: "Sold Outside",
    statusColor: "text-[#EAB308]",
    statusBg: "bg-[#EAB308]",
    buyerName: "Krishna Reddy",
    buyerType: "Application Customer",
    buyerTypeColor: "text-[#3B82F6]",
    assignedDate: "12 October 2025 • 10:30 AM",
    soldDate: "14 November 2025 • 2:15 PM"
  },
  {
    id: "3",
    farmlandId: "GLCSOS 01",
    agent: "Rajesh Kumar",
    location: "West Godaveri, Tanuku",
    price: "₹1.2 Crores",
    acres: 50,
    pricePerAcre: "₹24,000",
    status: "Removed",
    statusColor: "text-[#6B7280]",
    statusBg: "bg-[#9CA3AF]",
    buyerName: "Rajesh G.",
    buyerType: "Withdrawn",
    buyerTypeColor: "text-[#6B7280]",
    assignedDate: "12 October 2025 • 10:30 AM",
    soldDate: "14 November 2025 • 2:15 PM"
  },
  {
    id: "4",
    farmlandId: "GLCSOS 01",
    agent: "Rajesh Kumar",
    location: "West Godaveri, Tanuku",
    price: "₹25 Lakhs",
    acres: 100,
    pricePerAcre: "₹10,000",
    status: "Sold to Application",
    statusColor: "text-[#16A34A]",
    statusBg: "bg-[#16A34A]",
    buyerName: "Krishna Reddy",
    buyerType: "Application Customer",
    buyerTypeColor: "text-[#3B82F6]",
    assignedDate: "12 October 2025 • 10:30 AM",
    soldDate: "14 November 2025 • 2:15 PM"
  },
  {
    id: "5",
    farmlandId: "GLCSOS 01",
    agent: "Rajesh Kumar",
    location: "West Godaveri, Tanuku",
    price: "₹25 Lakhs",
    acres: 100,
    pricePerAcre: "₹10,000",
    status: "Sold to Application",
    statusColor: "text-[#16A34A]",
    statusBg: "bg-[#16A34A]",
    buyerName: "Krishna Reddy",
    buyerType: "Application Customer",
    buyerTypeColor: "text-[#3B82F6]",
    assignedDate: "12 October 2025 • 10:30 AM",
    soldDate: "14 November 2025 • 2:15 PM"
  },
  {
    id: "6",
    farmlandId: "GLCSOS 01",
    agent: "Rajesh Kumar",
    location: "West Godaveri, Tanuku",
    price: "₹25 Lakhs",
    acres: 100,
    pricePerAcre: "₹10,000",
    status: "Sold to Application",
    statusColor: "text-[#16A34A]",
    statusBg: "bg-[#16A34A]",
    buyerName: "Krishna Reddy",
    buyerType: "Application Customer",
    buyerTypeColor: "text-[#3B82F6]",
    assignedDate: "12 October 2025 • 10:30 AM",
    soldDate: "14 November 2025 • 2:15 PM"
  }
];

const SuperAdminSoldOutTable: React.FC = () => {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl border border-gray-100">
      <table className="w-full min-w-[900px] text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="font-semibold text-sm text-[var(--text-primary)] py-4 px-6">Farmland Details</th>
            <th className="font-semibold text-sm text-[var(--text-primary)] py-4 px-6">Transaction</th>
            <th className="font-semibold text-sm text-[var(--text-primary)] py-4 px-6">Status</th>
            <th className="font-semibold text-sm text-[var(--text-primary)] py-4 px-6">Buyer</th>
            <th className="font-semibold text-sm text-[var(--text-primary)] py-4 px-6">Timeline</th>
            <th className="font-semibold text-sm text-[var(--text-primary)] py-4 px-6">Action</th>
          </tr>
        </thead>
        <tbody>
          {soldOutData.map((row, idx) => (
            <tr key={row.id} className={cn("hover:bg-gray-50/50 transition-colors", idx !== soldOutData.length - 1 && "border-b border-gray-100")}>
              {/* Farmland Details */}
              <td className="py-5 px-6">
                <div className="font-bold text-[var(--text-primary)] text-sm mb-1">{row.farmlandId}</div>
                <div className="text-[13px] text-[var(--text-muted)]">{row.agent} • {row.location}</div>
              </td>
              
              {/* Transaction */}
              <td className="py-5 px-6">
                <div className="font-bold text-[var(--text-primary)] text-sm mb-1">{row.price}</div>
                <div className="text-[13px] text-[var(--text-muted)]">{row.acres} acres • {row.pricePerAcre} / acre</div>
              </td>
              
              {/* Status */}
              <td className="py-5 px-6">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <div className={cn("w-3.5 h-3.5 rounded-full opacity-20", row.statusBg)}></div>
                    <div className={cn("w-2 h-2 rounded-full absolute", row.statusBg)}></div>
                  </div>
                  <span className={cn("text-sm font-semibold", row.statusColor)}>{row.status}</span>
                </div>
              </td>
              
              {/* Buyer */}
              <td className="py-5 px-6">
                <div className="font-medium text-[var(--text-primary)] text-sm mb-1">{row.buyerName}</div>
                <div className={cn("text-[13px]", row.buyerTypeColor)}>{row.buyerType}</div>
              </td>
              
              {/* Timeline */}
              <td className="py-5 px-6">
                <div className="text-[13px] text-[var(--text-muted)] mb-1">Assigned : {row.assignedDate}</div>
                <div className="text-[13px] text-[var(--text-muted)]">Sold : {row.soldDate}</div>
              </td>
              
              {/* Action */}
              <td className="py-5 px-6">
                <div className="relative inline-block">
                  <button 
                    onClick={() => toggleDropdown(row.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-600"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {openDropdownId === row.id && (
                    <div className="absolute right-0 top-10 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                      <button 
                        onClick={() => {
                          toggleDropdown(row.id);
                          navigate(`/super-admin/farmlands-list/${row.id}`);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-50"
                      >
                        View
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-gray-50">Stats</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuperAdminSoldOutTable;
