import React, { useState } from 'react';
import { ChevronDownIcon } from './Icons';

// ─── Dropdown Field (single value with chevron) ──────────────────────────────

export const DropdownField: React.FC<{ label: string; value: string; options?: string[] }> = ({ label, value, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  return (
    <div className="mb-6 relative">
      <h3 className="text-[22px] font-bold text-gray-900 mb-6">{label}</h3>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between bg-white border ${isOpen ? 'border-[#A3C33D]' : 'border-gray-200'} rounded-2xl px-5 py-4 cursor-pointer hover:border-gray-300 transition-colors`}
      >
        <span className="text-[15px] text-gray-800 font-medium">{selectedValue}</span>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </div>
      </div>
      
      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 py-2">
          {options.map((opt) => (
            <div 
              key={opt}
              onClick={() => {
                setSelectedValue(opt);
                setIsOpen(false);
              }}
              className="px-5 py-3 hover:bg-gray-50 cursor-pointer text-[15px] text-gray-800 font-medium"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
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
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6">
      <h3 className="text-[22px] font-bold text-gray-900 mb-6">{label}</h3>
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 bg-white border ${isOpen ? 'border-[#A3C33D]' : 'border-gray-200'} rounded-2xl px-4 py-3.5 cursor-pointer hover:border-gray-300 transition-colors`}
        >
          {tags.map((tag) => (
            <span key={tag} className="bg-[#A3C33D] text-white text-[13px] font-semibold px-3 py-1 rounded-lg">{tag}</span>
          ))}
          <div className="flex-1" />
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
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
  const defaultSelected = options.find(o => o.selected)?.label || options[0]?.label;
  const [selectedOpt, setSelectedOpt] = useState(defaultSelected);

  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-[16px] font-bold text-gray-900 mb-4">{label}</h3>
      <div className="flex flex-wrap items-center gap-4">
        {options.map((opt) => {
          const isSelected = selectedOpt === opt.label;
          return (
            <div
              key={opt.label}
              onClick={() => setSelectedOpt(opt.label)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#2A3125] text-white border-[#2A3125]'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
              }`}
            >
              {isSelected ? (
                <div className="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shrink-0 transition-all duration-200">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#529CFA]" />
                </div>
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-400 bg-white shrink-0 transition-all duration-200" />
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
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-[16px] font-bold text-gray-900 mb-4">{label}</h3>
      <input
        type="text"
        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-[15px] text-gray-800 font-medium outline-none focus:border-[#A3C33D] transition-colors"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
