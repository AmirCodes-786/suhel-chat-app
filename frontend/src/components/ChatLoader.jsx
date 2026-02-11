import { MessageCircleIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: "linear-gradient(165deg, #0f0f1a, #1a1a2e)",
      }}
    >
      {/* Pulsing icon */}
      <div
        className="relative mb-6"
        style={{
          animation: "pulse-glow 2s infinite",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
          }}
        >
          <MessageCircleIcon className="size-8 text-white" />
        </div>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              animation: `bounce-dot 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>

      <p
        className="text-sm font-medium tracking-wide"
        style={{
          color: "#a1a1aa",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Connecting to chat...
      </p>
    </div>
  );
}

export default ChatLoader;
