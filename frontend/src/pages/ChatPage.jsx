import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { AlertTriangleIcon, XIcon } from "lucide-react";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  MessageSimple,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import ClearChatButton from "../components/ClearChatButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: "", // "forMe" or "forEveryone"
    message: null,
  });

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  // Confirm the pending delete action
  const confirmDelete = async () => {
    const { type, message } = deleteModal;
    if (!message) return;

    if (type === "forMe") {
      const channelId = channel?.id || "default";
      const key = `hidden_messages_${channelId}`;
      const hiddenIds = JSON.parse(localStorage.getItem(key) || "[]");
      hiddenIds.push(message.id);
      localStorage.setItem(key, JSON.stringify(hiddenIds));

      const el = document.querySelector(`[data-message-id="${message.id}"]`);
      if (el) {
        el.style.transition = "all 0.3s ease";
        el.style.opacity = "0";
        el.style.transform = "scale(0.95)";
        setTimeout(() => {
          el.style.display = "none";
        }, 300);
      }
      toast.success("Message hidden");
    } else if (type === "forEveryone") {
      try {
        await chatClient.deleteMessage(message.id);
        toast.success("Message deleted for everyone");
      } catch (err) {
        console.error("Error deleting message:", err);
        toast.error("Failed to delete message");
      }
    }

    setDeleteModal({ show: false, type: "", message: null });
  };

  // Auto-focus input when user starts typing anywhere
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.startsWith("F") && e.key.length > 1) return;
      if (["Tab", "Escape", "Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key)) return;

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT")) return;

      const textarea = document.querySelector(".str-chat__textarea textarea");
      if (textarea) {
        textarea.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom message component
  const CustomMessage = useCallback(
    (props) => {
      const channelId = channel?.id || "default";
      const storageKey = `hidden_messages_${channelId}`;
      const hidden = JSON.parse(localStorage.getItem(storageKey) || "[]");

      if (hidden.includes(props.message?.id)) {
        return null;
      }

      const isOwnMessage = props.message?.user?.id === chatClient?.userID;

      const actions = {
        "Delete for me": (message) => {
          setDeleteModal({ show: true, type: "forMe", message });
        },
      };

      if (isOwnMessage) {
        actions["Delete for everyone"] = (message) => {
          setDeleteModal({ show: true, type: "forEveryone", message });
        };
      }

      return <MessageSimple {...props} customMessageActions={actions} />;
    },
    [channel?.id, chatClient]
  );

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100dvh-4rem)]">
      <Chat client={chatClient}>
        <Channel channel={channel} Message={CustomMessage}>
          <div className="w-full relative">
            <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
              <ClearChatButton channel={channel} />
              <CallButton handleVideoCall={handleVideoCall} />
            </div>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-2xl p-6 relative"
            style={{
              background: "rgba(26, 26, 46, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              animation: "fade-in-up 0.2s ease-out",
            }}
          >
            <button
              onClick={() => setDeleteModal({ show: false, type: "", message: null })}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "#a1a1aa" }}
            >
              <XIcon className="size-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: "rgba(239, 68, 68, 0.15)" }}
              >
                <AlertTriangleIcon className="size-5" style={{ color: "#f87171" }} />
              </div>
              <h3 className="font-semibold text-lg" style={{ color: "#e4e4e7" }}>
                Delete Message
              </h3>
            </div>

            <p className="text-sm mb-6" style={{ color: "#a1a1aa", lineHeight: "1.6" }}>
              {deleteModal.type === "forMe"
                ? "This will hide the message from your view only. Other participants can still see it."
                : <>This will delete the message for <strong style={{ color: "#f87171" }}>everyone</strong> in this chat. This action cannot be undone.</>
              }
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, type: "", message: null })}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10"
                style={{
                  color: "#a1a1aa",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background: deleteModal.type === "forMe"
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "linear-gradient(135deg, #ef4444, #dc2626)",
                  boxShadow: deleteModal.type === "forMe"
                    ? "0 2px 8px rgba(102, 126, 234, 0.3)"
                    : "0 2px 8px rgba(239, 68, 68, 0.3)",
                }}
              >
                {deleteModal.type === "forMe" ? "Hide Message" : "Delete for Everyone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatPage;
