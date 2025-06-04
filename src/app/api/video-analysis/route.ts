import { transcript } from "./sample_transcript";
import { GoogleGenAI } from "@google/genai";
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

async function getSummary(transcript: unknown) {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze the following YouTube transcript and summarize the key points:\n\n${transcript}. Keep the summary concise (4-5 sentences) and focused on the main ideas presented in the video. Do not include any personal opinions or interpretations. Provide a clear and objective summary of the content. `,
    });

    const result = response.text; // or response.data, depending on the API
    console.log("Analysis complete:", result);
    return result;
  } catch (error) {
    console.error("Error in getTranscript:", error);
  }
}

//function to get the timestamps of the video

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body.url;
    console.log("Received body:", url);
    const videoId = url.split("v=")[1].split("&")[0];
    console.log("Extracted video ID:", videoId);

    const parserUrl = `https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`;
    console.log("Parser URL:", parserUrl);
    //console.log("Sample Transcript:", sample_transcript);

    // const options = {
    //   method: "GET",
    //   headers: {
    //     "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
    //     "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com",
    //   },
    // };

    // const response = await fetch(parserUrl, options);
    // const data = await response.json();
    //const transcript = data.transcript
    // console.log("API Response:", transcript);
    const allText = transcript.transcript.map((item) => item.text).join(" ");

    const summary = await getSummary(allText);
    console.log("Summary:", summary);

    return new Response(
      JSON.stringify({
        message: "Video ID extracted successfully",
        videoId: videoId,
        summary: summary,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //   JSON.stringify({
    //     message: "Video ID extracted successfully",
    //     videoId: videoId,
    //   }),
    //   {
    //     status: 200,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
  } catch (error) {
    console.log("Error:", error);
  }
}
