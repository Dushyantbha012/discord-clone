"use client";
import * as z from "zod";

interface ChatInputprops {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

function ChatInput({ apiUrl, query, name, type }: ChatInputprops) {
  return <div>ChatInput</div>;
}

export default ChatInput;
