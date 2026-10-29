import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, TrendingUp, Search, Clock, Award, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const tagsList=[
  { id: "trending", label: "Trending Farmland", icon: TrendingUp, pos: "top", selected: true },
  { id: "most_searched", label: "Most Searched", icon: Search, pos: "top-right", selected: false },
  { id: "newly_listed", label: "Newly Listed", icon: Clock, pos: "right", selected: false },
  { id: "best_sellers", label: "Best Sellers", icon: Award, pos: "bottom-right", selected: false },
  { id: "hot_deals", label: "Hot Deals", icon: Flame, pos: "bottom", selected: false },
  { id: "glc_certified", label: "GLC Certified", icon: CheckCircle2, pos: "left", selected: true },
];

const SuperAdminEditFarmlandTag: React.FC=() => {
  const navigate=useNavigate();
  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({
    trending: true,
    glc_certified: true,
  });

  const toggleTag=(id: string) => {
    setSelectedTags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getPosClasses=(pos: string) => {
    switch (pos) {
      case "top": return "top-[5%] left-1/2 -translate-x-1/2";
      case "top-right": return "top-[20%] right-[15%]";
      case "right": return "top-1/2 right-[5%] -translate-y-1/2";
      case "bottom-right": return "bottom-[20%] right-[15%]";
      case "bottom": return "bottom-[15%] left-1/2 -translate-x-1/2";
      case "left": return "top-1/2 left-[5%] -translate-y-1/2";
      default: return "";
    }
  };

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      <div className="bg-[#F6F7F6] rounded-[24px] p-6 flex flex-col gap-8 min-h-screen relative">
        
        {/* Go Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors shadow-sm"
           >
            <ArrowLeft size={18} />
            Go back to Farmland List
          </button>
        </div>

        {/* Main Card */}
        <div className="mt-16 bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col relative overflow-hidden">
          
          <div className="mb-6 z-20 relative">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Add Tag</h2>
            <p className="text-sm text-[#8BA3BA] max-w-sm">
              Please select tags below to categorize the farmlands in Website/App.
            </p>
          </div>

          {/* Node Graph Area */}
          <div className="relative flex-1 flex items-center justify-center min-h-[500px] w-full max-w-[800px] mx-auto z-10">
            
            {/* The dotted circle */}
            <div className="absolute w-[450px] h-[450px] border border-dashed border-gray-300 rounded-full"></div>
            
            {/* Dashed lines connecting to center (cross pattern) */}
            <div className="absolute w-[450px] h-[1px] border-t border-dashed border-gray-300"></div>
            <div className="absolute h-[450px] w-[1px] border-l border-dashed border-gray-300"></div>
            
            {/* Tags */}
            {tagsList.map((tag) => {
              const isSelected=selectedTags[tag.id];
              const Icon=tag.icon;
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "absolute flex items-center gap-2 px-4 py-2 rounded-full border bg-white transition-all duration-200 hover:scale-105 shadow-sm z-20",
                    getPosClasses(tag.pos),
                    isSelected 
                      ? "border-[#8B9A46] text-[#8B9A46]" 
                      : "border-gray-200 text-gray-500"
                  )}
                >
                  <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} />
                  <span className="text-sm font-semibold">{tag.label}</span>
                </button>
              );
            })}

            {/* Center Box */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F9FBF9] rounded-[20px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col w-[320px] z-30">
              
              <div className="flex justify-between w-full text-[13px] mb-3">
                 <span className="text-[#8BA3BA] font-medium">Farmland ID</span>
                 <span className="font-bold text-gray-800">GLCSOS 01</span>
              </div>
              <div className="flex justify-between w-full text-[13px] mb-3">
                 <span className="text-[#8BA3BA] font-medium">Area</span>
                 <span className="font-bold text-gray-800">120 acres</span>
              </div>
              <div className="flex justify-between w-full text-[13px] mb-4">
                 <span className="text-[#8BA3BA] font-medium">Location</span>
                 <span className="font-bold text-gray-800">West Godaveri, Tanuku</span>
              </div>
                      
              <hr className="w-full my-2 border-gray-200 border-dashed" />
              
              <div className="flex flex-col items-center mt-3">
                <div className="text-[10px] font-bold text-[#8BA3BA] tracking-wider uppercase mb-2">
                  Market Positioning Summary
                </div>
                <div className="text-[15px] font-bold text-[#8B9A46]">
                  High Demand • Trusted
                </div>
              </div>
              
            </div>
            
          </div>
          
          {/* Add Tags Button */}
          <div className="flex justify-center mt-6 z-20">
            <button 
              onClick={() => navigate(-1)}
              className="bg-[#2D3319] hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-colors w-40"
            >
              Add Tags
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuperAdminEditFarmlandTag;
