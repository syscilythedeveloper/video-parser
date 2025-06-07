"use client";

import { Button, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { TiMessageTyping } from "react-icons/ti";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask questions about the video, and I will do my best to answer them based on the content of the video.",
    },
  ]);
  const [message, setMessage] = useState("");

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
          width="100vh"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          className="prose prose-lg max-w-none max-h-80 overflow-y-auto"
        >
          <Stack
            direction="column"
            width="700"
            height="700px"
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
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={message.role === "assistant" ? "pink" : "purple"}
                    color="white"
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))}
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
