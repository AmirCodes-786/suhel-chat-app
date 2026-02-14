
import { generateStreamToken, streamClient, StreamChat } from "../lib/stream.js";

export async function clearChat(req, res) {
  try {
    const { channelId } = req.body;
    console.log("Attempting to clear chat for channel:", channelId);
    
    // Create a FRESH instance for this admin action to avoid any user context pollution
    const client = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
    const channel = client.channel("messaging", channelId);
    
    // Truncate the channel (clear messages) with hard_delete options
    await channel.truncate({ hard_delete: true });
    
    console.log("Chat cleared successfully for channel:", channelId);
    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.error("Error in clearChat controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}


export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
