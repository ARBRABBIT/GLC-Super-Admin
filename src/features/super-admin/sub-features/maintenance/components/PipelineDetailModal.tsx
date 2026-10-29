import React from "react";
import { X, CheckCircle2, Clock } from "lucide-react";
import type { PipelineStage } from "../types/maintenance.types";

interface PipelineDetailModalProps {
  stage: PipelineStage | null;
  onClose: () => void;
}

export const PipelineDetailModal: React.FC<PipelineDetailModalProps> = ({ stage, onClose }) => {
  if (!stage) return null;

  // Mock stage specific items for interactive demonstration
  const sampleItems = [
    {
      id: "SR-101",
      code: "GLC SOS 01",
      mandal: "Chevellla",
      type: "FARMHOUSE",
      description: "Water pipe replacement and ceiling repair",
      assignedTo: "Ramesh K.",
      time: "2h ago",
      priority: "High"
    },
    {
      id: "WO-204",
      code: "GLC SOS 07",
      mandal: "Shadnagar",
      type: "FENCING",
      description: "Boundary perimeter steel wire installation",
      assignedTo: "Suresh P.",
      time: "5h ago",
      priority: "Medium"
    },
    {
      id: "SR-108",
      code: "GLC SOS 09",
      mandal: "Moinabad",
      type: "BOREWELL",
      description: "Submersible pump sensor calibration",
      assignedTo: "Venkat R.",
      time: "1d ago",
      priority: "Urgent"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stage.iconBgColor, color: stage.iconColor }}
            >
              <span className="font-bold text-lg">{stage.count}</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-gray-900 m-0">
                {stage.title}
              </h3>
              <p className="text-xs text-gray-500 m-0 font-medium">
                {stage.subtitle} &bull; {stage.count} Active Requests in this Stage
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="py-4 overflow-y-auto flex flex-col gap-3">
          {sampleItems.slice(0, Math.min(sampleItems.length, stage.count)).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {item.id}
                  </span>
                  <span className="font-semibold text-xs text-gray-800">{item.code}</span>
                  <span className="text-[11px] text-gray-400">&bull; {item.mandal} Mandal</span>
                </div>
                <p className="text-xs text-gray-600 m-0 font-medium">{item.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </span>
                  <span>Assigned: {item.assignedTo}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.priority === "Urgent"
                      ? "bg-red-100 text-red-700"
                      : item.priority === "High"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.priority}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Showing top priority tickets</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1E75BB] text-white text-xs font-bold hover:bg-[#1864A0] transition-colors border-none cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
