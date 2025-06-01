"use client";

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import {
  ExpandableChat,
  ExpandableChatBody,
  ExpandableChatFooter,
  ExpandableChatHeader,
} from "@/components/chat/expandable-chat";
import { Button } from "@/components/ui/button";
import { useAccounts } from "@mysten/dapp-kit";
import { Bot, CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import MessageMarkdown from "./message/message-markdown";
import { SuggestedPrompts } from "./suggested-prompts";
import { QuickPrompts } from "./quick-prompts";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello, how can I help you today?",
      sender: "ai",
    },
  ]);
  const accounts = useAccounts();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Store the user message
    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: userMessage,
        sender: "user",
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      // Use hardcoded URL if environment variable is not set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const requestUrl = `${apiUrl}/api/chat`;

      console.log("Sending request to:", requestUrl);
      console.log("Request body:", {
        message: userMessage,
        address: accounts[0]?.address || null,
      });

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          address: accounts[0]?.address || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: data.response || data.prompt || "Sorry, I couldn't process your request.",
          sender: "ai",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);

      // Show error toast
      toast.error("Failed to send message. Please try again.");

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: "Sorry, I encountered an error. Please try again later.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachFile = () => {
    //
  };

  const handleMicrophoneClick = () => {
    //
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    // Optionally auto-submit
    handleSubmit(new Event("submit") as unknown as FormEvent);
  };

  // Show suggested prompts only when there's just the welcome message
  const showSuggestedPrompts = messages.length === 1 && !isLoading;

  return (
    <div className="relative">
      <ExpandableChat size="lg" position="bottom-right" icon={<Bot className="h-6 w-6" />}>
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Chat with AI ✨</h1>
          <p className="text-sm text-muted-foreground">Ask me anything about the portfolio</p>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.sender === "ai" && (
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={"https://api.dicebear.com/7.x/bottts/svg?seed=ai-bot"}
                    fallback={"AI"}
                  />
                )}
                <ChatBubbleMessage variant={message.sender === "user" ? "sent" : "received"}>
                  <MessageMarkdown>{message.content}</MessageMarkdown>
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isLoading && (
              <ChatBubble variant={"received"}>
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src={"https://api.dicebear.com/7.x/bottts/svg?seed=ai-bot"}
                  fallback={"AI"}
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}

            {/* Show suggested prompts when appropriate */}
            {showSuggestedPrompts && (
              <SuggestedPrompts
                onPromptClick={handlePromptClick}
                isVisible={showSuggestedPrompts}
              />
            )}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          {/* Quick prompts for easy access */}
          <QuickPrompts onPromptClick={handlePromptClick} isVisible={!input.trim() && !isLoading} />

          <form
            onSubmit={handleSubmit}
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          >
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              disabled={isLoading}
            />
            <div className="flex items-center p-3 pt-0 justify-between">
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleAttachFile}
                  disabled={true || isLoading}
                >
                  <Paperclip className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleMicrophoneClick}
                  disabled={true || isLoading}
                >
                  <Mic className="size-4" />
                </Button>
              </div>
              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
                disabled={isLoading || !input.trim()}
              >
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
}
