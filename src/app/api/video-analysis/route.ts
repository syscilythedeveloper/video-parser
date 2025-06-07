import { GoogleGenerativeAI } from "@google/generative-ai";
import { transcript } from "./sample_transcript";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body.url;
    console.log("Received body:", url);
    const videoId = url.split("v=")[1].split("&")[0];
    console.log("Extracted video ID:", videoId);

    const parserUrl = `https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`;
    console.log("Parser URL:", parserUrl);

    // const options = {
    //   method: "GET",
    //   headers: {
    //     "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
    //     "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com",
    //   },
    // };

    //const response = await fetch(parserUrl, options);
    //const data = await response.json();
    //const transcript = data.transcript;
    const sample_transcript = transcript.transcript;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `Analyze the following transcript and providea breakdown of the main topics that are discussed in the video,   with timestamps for each topic..  
      <VideoTranscript>
      ${sample_transcript.map((t: { offset: string; text: string }) => `[${t.offset}] ${t.text}`).join("\n")}

      <VideoTranscript/>

    CRITICAL: Your response must be raw JSON only. Do not use code blocks, markdown formatting, or any wrapper text. Start your response immediately with the opening brace. If the seconds are over 59, format them as minutes and seconds. For example, 93 seconds should be formatted as 01:33.{

    Required JSON format: 
    {
      "topics": [
        {
          "timestamp": "HH:MM:SS",
          "topic": "Topic name"
        }
      ]
    }
    `;

    const result = await model.generateContent([prompt]);

    const summaryRaw = result.response.text();
    const cleaned = summaryRaw
      .replace(/^```json\s*/i, "") // Remove starting ```json (case-insensitive)
      .replace(/```$/, "") // Remove ending ```
      .trim();
    const summaryJson = JSON.parse(cleaned);
    console.log("Parsed summary JSON:", summaryJson);

    return new Response(
      JSON.stringify({
        message: "Video ID extracted successfully",
        videoId: videoId,
        summary: summaryJson,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("Error:", error);
  }
}
