import React, { useState } from "react";

export interface CommentsProps {
  commentValue: string;
  onCommentChange: (val: string) => void;
  activeTabLabel: string;
  mockDictationSuffix?: string; // e.g. " Survey Report."
}

export const Comments: React.FC<CommentsProps> = ({
  commentValue,
  onCommentChange,
  activeTabLabel,
  mockDictationSuffix = ".",
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      const mockDictation = ` This is a voice-dictated comment for ${activeTabLabel}${mockDictationSuffix}`;
      setTimeout(() => {
        onCommentChange(commentValue + mockDictation);
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="relative w-full h-[150px] bg-[rgba(230,238,173,0.3)] border border-[#E6EEAD] rounded-[18px] p-4 flex flex-col">
      <textarea
        value={commentValue}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Write a comment"
        maxLength={500}
        className="bg-transparent resize-none border-none outline-none text-black placeholder-[rgba(0,0,0,0.4)] font-sans text-[16px] leading-[24px] w-full flex-1"
      />
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`flex items-center justify-center text-white rounded-full transition-all cursor-pointer w-[40px] h-[40px] border-none ${
            isListening ? "bg-red-600 animate-pulse" : "bg-[#2D3509] hover:opacity-90"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
      </div>
    </div>
  );
};
