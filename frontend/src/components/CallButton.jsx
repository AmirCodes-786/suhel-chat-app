import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button
      onClick={handleVideoCall}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 2px 12px rgba(102, 126, 234, 0.35)",
      }}
    >
      <VideoIcon className="size-4 transition-transform duration-300 group-hover:scale-110" />
      <span className="hidden sm:inline">Call</span>
    </button>
  );
}

export default CallButton;
