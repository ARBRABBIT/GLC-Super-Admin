import React from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  dateTag: string;
  category: string;
  message: string;
  time: string;
  unread: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Sales Target Milestone",
    dateTag: "Today",
    category: "Revenue Peak",
    message: "Wednesday actuals have hit a high of ₹45 Cr, successfully surpassing the projected target.",
    time: "1:30PM",
    unread: true,
  },
  {
    id: "2",
    title: "Queue Management Alert",
    dateTag: "Today",
    category: "Backlog Warning",
    message: "There are currently 2,427 assets marked as In-Progress. Consider allocating additional resources.",
    time: "10:30AM",
    unread: true,
  },
  {
    id: "3",
    title: "Top Performer Recognition",
    dateTag: "Yesterday",
    category: "Leaderboard Update",
    message: "Arjun V. maintains the Top Performer status with ₹4.2 L in secured sales.",
    time: "3:30PM",
    unread: false,
  },
  {
    id: "4",
    title: "Subscriber Growth Insight",
    dateTag: "22/05/26",
    category: "Tier Acquisition Update",
    message: "Weekly land acquisition is strong, reaching 1,247 total units, driven by Platinum subscriptions.",
    time: "3:30PM",
    unread: false,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SuperAdminNotificationsDropdown: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible overlay to close when clicking outside */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown Card */}
      <div className="absolute top-[calc(100%+12px)] right-0 w-[380px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold text-[#2D3032]">Notifications</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col max-h-[480px] overflow-y-auto custom-scrollbar">
          {mockNotifications.map((notification, index) => (
            <div 
              key={notification.id} 
              className={cn(
                "relative flex flex-col p-6 hover:bg-gray-50/50 transition-colors cursor-pointer group",
                index !== mockNotifications.length - 1 && "border-b border-gray-50/80"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-bold text-[#2D3032]">{notification.title}</h4>
                  <span className="text-[11px] font-medium text-[#78909C]">{notification.dateTag}</span>
                </div>
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-[#2196F3] shrink-0 mt-1" />
                )}
              </div>
              
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1 h-1 rounded-full bg-[#B0BEC5]" />
                <span className="text-[11px] font-medium text-[#90A4AE]">{notification.category}</span>
              </div>
              
              <p className="text-[12px] text-gray-500 leading-relaxed pr-8">
                {notification.message}
              </p>
              
              <span className="absolute bottom-6 right-6 text-[10px] font-bold text-[#B0BEC5]">
                {notification.time}
              </span>
              
              {/* Highlight bar for unread (optional visual cue seen in some designs) */}
              {notification.unread && (
                <div className="absolute right-0 top-6 bottom-6 w-1 bg-blue-100/50 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SuperAdminNotificationsDropdown;
