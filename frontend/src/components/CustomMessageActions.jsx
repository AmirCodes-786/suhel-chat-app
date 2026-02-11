import { useCallback } from "react";
import {
    useChannelActionContext,
    useChannelStateContext,
    useMessageContext,
    useChatContext,
} from "stream-chat-react";
import { Trash2Icon, TrashIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";

const CustomMessageActions = () => {
    const { message } = useMessageContext();
    const { client } = useChatContext();
    const { channel } = useChannelStateContext();

    const isOwnMessage = message.user?.id === client.userID;

    // Delete for everyone (hard delete via API)
    const handleDeleteForEveryone = useCallback(async () => {
        if (!window.confirm("Delete this message for everyone?")) return;

        try {
            await client.deleteMessage(message.id, true); // hard delete
            toast.success("Message deleted for everyone");
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error("Failed to delete message");
        }
    }, [client, message.id]);

    // Delete for me (soft delete — hides from your view via local DOM removal)
    const handleDeleteForMe = useCallback(async () => {
        try {
            // Find and hide the message element from the DOM
            const messageEl = document.querySelector(
                `[data-message-id="${message.id}"]`
            );
            if (messageEl) {
                messageEl.style.transition = "all 0.3s ease";
                messageEl.style.opacity = "0";
                messageEl.style.transform = "scale(0.9)";
                messageEl.style.maxHeight = "0";
                messageEl.style.overflow = "hidden";
                setTimeout(() => {
                    messageEl.style.display = "none";
                }, 300);
            }

            // Store hidden message IDs in localStorage for persistence
            const channelId = channel?.id || "default";
            const storageKey = `hidden_messages_${channelId}`;
            const hidden = JSON.parse(localStorage.getItem(storageKey) || "[]");
            hidden.push(message.id);
            localStorage.setItem(storageKey, JSON.stringify(hidden));

            toast.success("Message hidden from your view");
        } catch (error) {
            console.error("Error hiding message:", error);
            toast.error("Failed to hide message");
        }
    }, [message.id, channel?.id]);

    return (
        <div className="custom-message-actions">
            {/* Delete for me — always available */}
            <button
                onClick={handleDeleteForMe}
                className="custom-action-btn"
            >
                <EyeOffIcon className="size-3.5" />
                <span>Delete for me</span>
            </button>

            {/* Delete for everyone — only your own messages */}
            {isOwnMessage && (
                <button
                    onClick={handleDeleteForEveryone}
                    className="custom-action-btn custom-action-btn--danger"
                >
                    <Trash2Icon className="size-3.5" />
                    <span>Delete for everyone</span>
                </button>
            )}
        </div>
    );
};

export default CustomMessageActions;
