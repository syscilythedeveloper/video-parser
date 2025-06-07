"use client";

import { Button, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState, useRef, useEffect } from "react";
import { TiMessageTyping } from "react-icons/ti";
import { TypeAnimation } from "react-type-animation";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask questions about the video, and I will do my best to answer them based on the content of the video.",
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
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const result = "";
      console.log(result);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessageIndex = updatedMessages.length - 1;
            updatedMessages[lastMessageIndex].content += text;
            return updatedMessages;
          });
        }
      }
      console.log("Message sent and response received successfully");
    } catch (error) {
      console.error("Failed to send or receive message:", error);
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <TiMessageTyping />

        <h2 className="text-xl font-semibold text-gray-800">
          Ask Questions About the Video
        </h2>
      </div>
      <div className="mb-4">
        <Box
          width="825px"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          className="prose prose-lg max-w-none max-h-80 overflow-y-auto"
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Stack
            direction="column"
            border="1px solid black"
            p={2}
            spacing={3}
          >
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              overflow="auto"
              maxHeight="100%"
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
                        message.content
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
            >
              <TextField
                label="Message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
