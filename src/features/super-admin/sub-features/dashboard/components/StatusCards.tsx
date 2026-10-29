import React from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from '@/features/super-admin/utils/formatters';
import type { StatusCardItem } from '@/features/super-admin/types/dashboard';
const rightIcon = "/super-admin/icons/right.svg";
const crossIcon = "/super-admin/icons/cross.svg";
const coneIcon = "/super-admin/icons/cone.svg";



interface Props {
  cards: StatusCardItem[];
}

const iconMap = {
  approved: {
    icon: rightIcon,
    bg: "bg-[#F3F4F6]",
  },
  rejected: {
    icon: crossIcon,
    bg: "bg-[#F3F4F6]",
  },
  "in-progress": {
    icon: coneIcon,
    bg: "bg-[#F3F4F6]",
  },
};

const StatusCards: React.FC<Props> = ({ cards }) => {
  return (
    <div className="flex gap-3 lg:gap-4">
      {cards.map((card) => {
        const config = iconMap[card.type];

        return (
          <div
            key={card.type}
            className={cn(
              "flex items-center gap-3 lg:gap-4",
              "bg-[var(--surface-card)] rounded-2xl shadow-sm",
              "px-4 lg:px-5 xl:px-6 py-3 lg:py-4",
              "flex-1 min-w-[120px]",
            )}
          >
            {/* Icon circle */}
            <div
  className={cn(
    "flex items-center justify-center shrink-0",
    "w-10 h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12",
    "rounded-full",
    config.bg,
  )}
>
  <img
    src={config.icon}
    alt={card.label}
    className="w-5 h-5 lg:w-6 lg:h-6"
  />
</div>

            {/* Value + Label */}
            <div className="flex flex-col gap-0">
              <span className="font-inter font-bold text-[1.125rem] lg:text-[1.25rem] xl:text-[1.375rem] text-[var(--text-primary)] leading-tight">
                {formatNumber(card.value)}
              </span>
              <span className="font-inter font-normal text-[0.6875rem] lg:text-[0.75rem] text-[var(--text-muted)]">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusCards;
