"use client";
import { Summary } from "../../page";
import { renderContentWithTimestamps } from "./FormattedResponses";

import { Button, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState, useRef, useEffect } from "react";
import { TiMessageTyping } from "react-icons/ti";
import { TypeAnimation } from "react-type-animation";

type ChatBoxProps = {
  videoId?: string;
  topics?: Summary;
  onTimestampClick: (timestamp: string) => void;
};

const ChatBox = ({ topics, onTimestampClick }: ChatBoxProps) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "What questions do you have about the video? You can ask about specific topics, events, or details mentioned in the video.",
    },
  ]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    // Add user message and a placeholder for the assistant's response
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          { ...messages },
          { role: "user", content: message },
          { topics: topics?.topics || [] },
        ]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          accumulatedText += text;
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessageIndex = updatedMessages.length - 1;
            updatedMessages[lastMessageIndex].content = accumulatedText;
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error("Failed to send or receive message:", error);
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <TiMessageTyping className="text-2xl text-purple-500 mr-2" />
        <h1 className="text-2xl font-bold text-white">Chat with AI</h1>
      </div>

      <div className="flex flex-col h-full">
        {/* Messages Area */}
        <div
          className="bg-gray-300 rounded-xl p-6 overflow-y-auto mb-4"
          style={{ height: "500px" }}
        >
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const isAssistant = message.role === "assistant";
            const isLoading =
              isLast && isAssistant && message.content.trim() === "";

            return (
              <Box
                key={index}
                display="flex"
                justifyContent={isAssistant ? "flex-start" : "flex-end"}
                mb={2}
              >
                <Box
                  bgcolor={isAssistant ? "blue" : "purple"}
                  color="white"
                  borderRadius={16}
                  p={3}
                  maxWidth="80%"
                >
                  {isLoading ? (
                    <TypeAnimation
                      sequence={["...", 100, "...", 100, "...", 100]}
                    />
                  ) : (
                    renderContentWithTimestamps(
                      message.content,
                      onTimestampClick
                    )
                  )}
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-300 rounded-xl p-4">
          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
            >
              Send
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
