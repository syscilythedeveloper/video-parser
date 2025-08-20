"use client";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ChatBox from "./components/Chat/chatbox";
import { VideoPlayer } from "./components/VideoPlayer";
import handleVideoDisplay from "./utils/videoDisplay";
export type Topic = { timestamp: string; topic: string };
export type Summary = { topics: Topic[] } | null;

export default function Home() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [summary, setSummary] = useState<Summary>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [embedSrc, setEmbedSrc] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoTimeStamp, setVideoTimeStamp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(youtubeLink);

    try {
      const res = await fetch("/api/video-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: videoId }),
      });
      const data = await res.json();
      setSummary(data.summary);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  function isValidYouTubeUrl(url: string) {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;
    return regex.test(url.trim());
  }
  const handleChatTimeStampClick = (timestamp: string) => {
    setVideoTimeStamp(timestamp);
  };
  useEffect(() => {
    if (videoId && videoTimeStamp) {
      const newTimeStamp = handleVideoDisplay(videoTimeStamp, videoId);

      setEmbedSrc(newTimeStamp);
    }
  }, [videoTimeStamp, videoId]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <header className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6
               bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-900/30"
              aria-hidden="true"
            >
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </div>

            <h1 className="text-5xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              VidSense AI
            </h1>

            <p className="text-xl text-gray-300/90 max-w-2xl mx-auto">
              Summaries, timestamps, answers — smarter video learning.
            </p>

            <span className="sr-only">
              Understand YouTube videos faster with AI-powered summaries and
              time-linked answers.
            </span>
          </header>

          {/* Main Content */}
          <div className="container mx-auto">
            <div className="flex flex-col xl:flex-row gap-8">
              {/* Left Container - Video + Summary */}
              <div className="xl:w-3/4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8 h-full">
                  {/* Input Section */}
                  <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Paste your YouTube video URL here..."
                          value={youtubeLink}
                          onChange={(e) => {
                            setVideoId(
                              `${e.target.value.split("v=")[1]?.split("&")[0]}`
                            );
                            setYoutubeLink(e.target.value);
                            setEmbedSrc(
                              `https://www.youtube.com/embed/${e.target.value.split("v=")[1]?.split("&")[0]}`
                            );
                          }}
                          className="w-full px-6 py-4 text-lg bg-gray-300  rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 placeholder-gray-500"
                          disabled={isLoading}
                        />
                        {youtubeLink && !isValidYouTubeUrl(youtubeLink) && (
                          <p className="text-red-500 mt-2 text-sm">
                            Please enter a valid YouTube video URL.
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading || !isValidYouTubeUrl(youtubeLink)}
                        className="px-8 py-4 bg-blue-600/90  text-gray-300 font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Video"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Video + Summary Section */}
                  {embedSrc && (
                    <div className="flex flex-col lg:flex-row gap-8 mt-8">
                      {/* Video Section */}
                      <div className="lg:w-2/3">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
                          <VideoPlayer src={embedSrc} />
                        </div>
                      </div>

                      {/* Video Summary */}
                      {summary && (
                        <div className="lg:w-1/3">
                          <div className="bg-gray-300 rounded-xl p-6 border border-gray-200 shadow-lg">
                            <div className="flex items-center mb-4">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <h2 className="text-xl font-semibold text-gray-800">
                                Video Summary
                              </h2>
                            </div>
                            <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
                              {summary.topics && (
                                <div>
                                  {summary.topics.map((topic, idx) => (
                                    <p
                                      key={idx}
                                      className="text-gray-700 leading-relaxed text-sm mb-3"
                                    >
                                      <span className="flex items-start">
                                        <button
                                          type="button"
                                          aria-label={`Jump to timestamp ${topic.timestamp}`}
                                          title={`Jump to timestamp ${topic.timestamp}`}
                                          onClick={() =>
                                            setVideoTimeStamp(topic.timestamp)
                                          }
                                          disabled={!videoId}
                                          className="text-gray-900 font-semibold bg-blue-200 border border-gray-400 rounded px-2 py-1 mr-2 text-xs shadow hover:bg-gray-300 hover:shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 flex-shrink-0"
                                        >
                                          {topic.timestamp}
                                        </button>
                                        <span>{topic.topic}</span>
                                      </span>
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-3 bg-white/95 rounded-lg px-6 py-3 border border-gray-200 shadow-md">
                        <svg
                          className="animate-spin h-5 w-5 text-purple-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-gray-700 font-medium">
                          Processing your video...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!summary && !isLoading && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">
                        Ready to analyze
                      </h3>
                      <p className="text-gray-400">
                        Enter a YouTube URL above to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Container - ChatBox */}
              {summary && (
                <div className="xl:w-2/5">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
                    <ChatBox
                      topics={summary}
                      onTimestampClick={handleChatTimeStampClick}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
