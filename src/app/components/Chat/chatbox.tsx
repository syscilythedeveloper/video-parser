"use client";
import { Summary } from "../../page";
import { renderContentWithTimestamps } from "./responseLinks";

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
      <div className="mb-4">
        <Box
          width="100%"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          className="prose prose-lg max-w-none max-h-100 overflow-y-auto"
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Stack
            direction="column"
            p={2}
            spacing={3}
          >
            <div className="flex items-center mb-4 sticky top-0 z-10 bg-white/95 rounded-xl p-2">
              <TiMessageTyping className="text-2xl text-purple-500 mr-2" />
              <h1 className="text-2xl font-bold">Chat with AI</h1>
            </div>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              // overflow="auto"
              width="100%"
              className="bg-white/95 rounded-xl p-6 prose prose-lg max-w-none max-h-80 overflow-y-auto"
              style={{ minHeight: 0 }}
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
                  >
                    <Box
                      bgcolor={isAssistant ? "gray" : "purple"}
                      color="white"
                      borderRadius={16}
                      p={3}
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
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              className="sticky bottom-0 z-10 bg-white/95 rounded-b-xl p-2"
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
          </Stack>
        </Box>
      </div>
    </>
  );
};

export default ChatBox;
