import { useState } from "react";
import { Trash2Icon, AlertTriangleIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";

const ClearChatButton = ({ channel }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [clearing, setClearing] = useState(false);

    const handleClearChat = async () => {
        setClearing(true);
        try {
            await channel.truncate({ hard_delete: true }); // no "deleted" placeholders
            toast.success("Chat cleared successfully");
            setShowConfirm(false);
        } catch (error) {
            console.error("Error clearing chat:", error);
            toast.error("Failed to clear chat");
        } finally {
            setClearing(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="group relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 active:scale-95"
                style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
                title="Clear Chat"
            >
                <Trash2Icon className="size-3.5" />
                <span className="hidden sm:inline text-xs">Clear</span>
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div
                        className="w-full max-w-sm rounded-2xl p-6 relative"
                        style={{
                            background: "rgba(26, 26, 46, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
                            style={{ color: "#a1a1aa" }}
                        >
                            <XIcon className="size-4" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="p-2.5 rounded-xl"
                                style={{
                                    background: "rgba(239, 68, 68, 0.15)",
                                }}
                            >
                                <AlertTriangleIcon className="size-5" style={{ color: "#f87171" }} />
                            </div>
                            <h3
                                className="font-semibold text-lg"
                                style={{ color: "#e4e4e7" }}
                            >
                                Clear Chat
                            </h3>
                        </div>

                        <p
                            className="text-sm mb-6"
                            style={{ color: "#a1a1aa", lineHeight: "1.6" }}
                        >
                            Are you sure you want to clear all messages? This action{" "}
                            <strong style={{ color: "#f87171" }}>cannot be undone</strong> and will
                            remove messages for all participants.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
                                style={{
                                    color: "#a1a1aa",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearChat}
                                disabled={clearing}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                                style={{
                                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                                }}
                            >
                                {clearing ? "Clearing..." : "Clear All Messages"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClearChatButton;
