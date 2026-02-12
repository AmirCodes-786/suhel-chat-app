import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { AlertTriangleIcon, XIcon, ChevronLeft, Paperclip, Smile, Send } from "lucide-react";

import {
  Channel,
  Chat,
  MessageList,
  MessageSimple,
  Thread,
  Window,
  useMessageInputContext,
  useChannelStateContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import ClearChatButton from "../components/ClearChatButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Custom WhatsApp-style Header
const MobileChatHeader = ({ handleVideoCall, channel }) => {
  const navigate = useNavigate();
  const { channel: activeChannel } = useChannelStateContext();

  // Get the other member's info
  const members = activeChannel?.state?.members || {};
  const { authUser } = useAuthUser();
  const targetMember = Object.values(members).find((m) => m.user.id !== authUser?._id);
  const user = targetMember?.user || {};

  return (
    <div className="flex items-center justify-between w-full h-16 px-2 sm:px-4 bg-base-100/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
        <button
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-90"
        >
          <ChevronLeft className="size-6 text-white" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-all flex-1 min-w-0">
          <div className="relative shrink-0">
            <img
              src={user.image || "https://avatar.iran.liara.run/public"}
              alt={user.name}
              className="size-10 rounded-full object-cover border border-white/10"
            />
            {user.online && (
              <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-base-100" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h2 className="font-bold text-white text-[0.95rem] truncate leading-tight">
              {user.name || "Chat"}
            </h2>
            <span className="text-[0.7rem] text-white/50 truncate">
              {user.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-2 mr-2">
          <ClearChatButton channel={activeChannel} />
        </div>
        <CallButton handleVideoCall={handleVideoCall} />
        <div className="sm:hidden ml-1">
          <ClearChatButton channel={activeChannel} />
        </div>
      </div>
    </div>
  );
};

// Custom WhatsApp-style Input
const ChatInput = () => {
  const {
    handleSubmit,
    text,
    handleChange,
    isUploadEnabled,
    uploadNewFiles,
  } = useMessageInputContext();

  return (
    <div className="p-3 bg-base-100/90 backdrop-blur-xl border-t border-white/5">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 flex items-center bg-white/5 border border-white/5 rounded-[24px] px-3 min-h-[44px]">
          <button className="p-2 text-white/40 hover:text-white transition-colors">
            <Smile className="size-5" />
          </button>

          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white text-[0.95rem] py-2.5 px-2 max-h-32 resize-none"
            rows={1}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />

          {isUploadEnabled && (
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e) => uploadNewFiles(e.target.files);
                input.click();
              }}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <Paperclip className="size-5" />
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="size-[44px] shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
        >
          <Send className="size-5 fill-current" />
        </button>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

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

  const confirmDelete = async () => {
    const { type, message } = deleteModal;
    if (!message) return;

    if (type === "forMe") {
      const channelId = channel?.id || "default";
      const key = `hidden_messages_${channelId}`;
      const hiddenIds = JSON.parse(localStorage.getItem(key) || "[]");
      hiddenIds.push(message.id);
      localStorage.setItem(key, JSON.stringify(hiddenIds));

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

  // Custom message component with pop animation
  const CustomMessage = useCallback(
    (props) => {
      const channelId = channel?.id || "default";
      const storageKey = `hidden_messages_${channelId}`;
      const hidden = JSON.parse(localStorage.getItem(storageKey) || "[]");

      if (hidden.includes(props.message?.id)) return null;

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

      return (
        <div className="message-wrapper py-1 touch-none">
          <MessageSimple {...props} customMessageActions={actions} />
        </div>
      );
    },
    [channel?.id, chatClient]
  );

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="fixed inset-0 bg-base-100 flex flex-col z-[1000] lg:relative lg:h-[calc(100dvh-4rem)] lg:z-auto">
      <Chat client={chatClient}>
        <Channel
          channel={channel}
          Message={CustomMessage}
          Input={ChatInput}
        >
          <Window>
            <MobileChatHeader handleVideoCall={handleVideoCall} />
            <div className="flex-1 overflow-hidden flex flex-col relative">
              <MessageList />
            </div>
          </Window>
          <Thread />
        </Channel>
      </Chat>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-[24px] p-6 relative overflow-hidden"
            style={{
              background: "rgba(26, 26, 46, 0.98)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
              animation: "message-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <button
              onClick={() => setDeleteModal({ show: false, type: "", message: null })}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <XIcon className="size-4 text-white/50" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-500">
                <AlertTriangleIcon className="size-6" />
              </div>
              <h3 className="font-bold text-xl text-white">Delete Message?</h3>
            </div>

            <p className="text-[0.95rem] text-white/60 mb-8 leading-relaxed">
              {deleteModal.type === "forMe"
                ? "This will hide the message from your view. The other person can still see it."
                : "This message will be deleted for everyone. This cannot be undone."
              }
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, type: "", message: null })}
                className="flex-1 py-3 rounded-2xl text-[0.95rem] font-semibold bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`flex-1 py-3 rounded-2xl text-[0.95rem] font-semibold text-white transition-all shadow-lg shadow-red-500/20 ${deleteModal.type === "forMe" ? "bg-primary" : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatPage;

