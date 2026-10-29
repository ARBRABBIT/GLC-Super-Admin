import { useNavigate } from "react-router-dom";

// ── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a6 6 0 0 1 6 6v3l1.5 2.5H2.5L4 11V8a6 6 0 0 1 6-6z" stroke="#555" strokeWidth="1.4" />
    <path d="M8 16a2 2 0 0 0 4 0" stroke="#555" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const VerifiedBadge = () => (
  <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
    {/* Starburst / seal shape */}
    <path
      d="M45 5 L50.5 18 L64 12 L62 26.5 L76 28 L68 39 L80 45 L68 51 L76 62 L62 63.5 L64 78 L50.5 72 L45 85 L39.5 72 L26 78 L28 63.5 L14 62 L22 51 L10 45 L22 39 L14 28 L28 26.5 L26 12 L39.5 18 Z"
      fill="#e8f5d0"
      stroke="#d0e8a0"
      strokeWidth="1"
    />
    {/* Inner filled circle */}
    <circle cx="45" cy="45" r="22" fill="#8fbc2a" />
    {/* Checkmark */}
    <path
      d="M34 45 L41 52 L56 37"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────

export default function SuperAdminPoolPublished() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans flex flex-col p-4 box-border">
      {/* Main white card container */}
      <div className="flex-1 bg-white rounded-[20px] flex flex-col overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between px-7 py-5">
          <button 
            className="inline-flex items-center gap-1.5 bg-white border border-[#e0e0e0] rounded-full px-[18px] py-[8px] text-[13px] font-medium text-[#222] cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/super-admin/pool-buying")}
          >
            <ArrowLeftIcon /> Go Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <button className="bg-transparent border-none cursor-pointer flex items-center p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <BellIcon />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#eee]">
              <img
                src="https://i.pravatar.cc/36?img=8"
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.style.background = "#8fbc5a";
                }}
              />
            </div>
          </div>
        </div>

        {/* Centered success card */}
        <div className="flex-1 flex items-center justify-center py-[60px] px-5">
          <div className="bg-white border border-[#ebebeb] rounded-[20px] pt-[40px] px-[48px] pb-[36px] flex flex-col items-center w-full max-w-[420px] shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <h2 className="text-[20px] font-bold text-[#111] m-0 mb-6 text-center tracking-tight">Pools Published</h2>

            <div className="mb-6">
              <VerifiedBadge />
            </div>

            <p className="text-[14px] text-[#666] text-center leading-[1.6] m-0 mb-7">
              Created Pools for hyderabad location<br />
              have been succesfully published
            </p>

            <button
              className="bg-[#2a2f1e] text-white border-none rounded-full py-[14px] px-[64px] text-[15px] font-semibold cursor-pointer tracking-wide w-full max-w-[240px] hover:bg-black transition-colors"
              onClick={() => navigate("/super-admin/pool-buying")}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
