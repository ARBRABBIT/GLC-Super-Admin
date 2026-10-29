import React from 'react';
import { ChevronDownIcon } from './Icons';

// ─── Dropdown Field (single value with chevron) ──────────────────────────────

export const DropdownField: React.FC<{ label: string; value: string; options?: string[] }> = ({ label, value }) => {
  return (
    <div className="mb-6 relative">
      <h3 className="text-[22px] font-bold text-gray-900 mb-6">{label}</h3>
      <div 
        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 cursor-default"
      >
        <span className="text-[15px] text-gray-500 font-medium">{value}</span>
        <div>
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
};

// ─── Text Field (read-only display) ──────────────────────────────────────────

export const TextField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-6">
    <h3 className="text-[22px] font-bold text-gray-900 mb-6">{label}</h3>
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
      <span className="text-[15px] text-gray-800 font-medium">{value}</span>
    </div>
  </div>
);

// ─── Multi-Tag Field (tags with chevron) ─────────────────────────────────────

export const MultiTagField: React.FC<{ label: string; tags: string[] }> = ({ label, tags }) => {
  return (
    <div className="mb-6">
      <h3 className="text-[22px] font-bold text-gray-900 mb-6">{label}</h3>
      <div className="relative">
        <div 
          className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 cursor-default"
        >
          {tags.map((tag) => (
            <span key={tag} className="bg-[#A3C33D] text-white text-[13px] font-semibold px-3 py-1 rounded-lg opacity-80">{tag}</span>
          ))}
          <div className="flex-1" />
          <div>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dual Text Field (two labeled values stacked) ────────────────────────────

export const DualTextField: React.FC<{ label1: string; value1: string; label2: string; value2: string }> = ({ label1, value1, label2, value2 }) => (
  <>
    <div className="mb-6">
      <h3 className="text-[22px] font-bold text-gray-900 mb-6">{label1}</h3>
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
        <span className="text-[15px] text-gray-800 font-medium">{value1}</span>
      </div>
    </div>
    <div className="mb-6">
      <h3 className="text-[22px] font-bold text-gray-900 mb-6">{label2}</h3>
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
        <span className="text-[15px] text-gray-800 font-medium">{value2}</span>
      </div>
    </div>
  </>
);

// ─── Radio Group Field ───────────────────────────────────────────────────────

export const RadioGroupField: React.FC<{ label: string; options: { label: string; selected: boolean }[] }> = ({ label, options }) => {
  const selectedOpt = options.find(o => o.selected)?.label || options[0]?.label;

  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-[16px] font-bold text-gray-900 mb-4">{label}</h3>
      <div className="flex flex-wrap items-center gap-4">
        {options.map((opt) => {
          const isSelected = selectedOpt === opt.label;
          return (
            <div
              key={opt.label}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border cursor-default ${
                isSelected
                  ? 'bg-[#2A3125] text-white border-[#2A3125] opacity-90'
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              {isSelected ? (
                <div className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shrink-0">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#A3C33D]" />
                </div>
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300 bg-white shrink-0" />
              )}
              <span className="text-[15px] font-medium select-none">{opt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Input Text Field (editable) ─────────────────────────────────────────────

export const InputTextField: React.FC<{ label: string; value: string; placeholder?: string }> = ({ label, value, placeholder }) => {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-[16px] font-bold text-gray-900 mb-4">{label}</h3>
      <input
        type="text"
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-600 font-medium outline-none cursor-default"
        value={value}
        readOnly
        placeholder={placeholder}
      />
    </div>
  );
};
