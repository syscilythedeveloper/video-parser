"use client";
import { useEffect, useState } from "react";
export default function Home() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [summary, setSummary] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(youtubeLink);
    e.preventDefault();
    try {
      const res = await fetch("/api/video-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeLink }),
      });
      const data = await res.json();
      setSummary(data.summary);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {}, [summary]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your youtube link"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setYoutubeLink(e.target.value)}
        ></input>
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      {summary && <h1>{summary}</h1>}
    </>
  );
}
