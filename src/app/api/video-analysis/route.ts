import { GoogleGenerativeAI } from "@google/generative-ai";
//import { sample_transcript } from "./sample_transcript";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const videoId = body.videoId;

    console.log("Video ID arg:", videoId);

    const parserUrl = `https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`;
    console.log("Parser URL:", parserUrl);

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
        "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com",
      },
    };

    const response = await fetch(parserUrl, options);
    const data = await response.json();
    const transcript = data.transcript;

    //const transcript = sample_transcript;
    console.log("-----------THIS IS THE TRANSCRIPT MAP");
    console.log(
      `${transcript.map((t: { offset: string; text: string }) => `[${t.offset}] ${t.text}`).join("\n")}`
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `Analyze the following transcript and providea breakdown of the main topics that are discussed in the video,   with timestamps for each topic... Note that the offsets in the transcripts are in seconds, so you will need to convert them to MM:SS or HH:MM:SS format.   
      <VideoTranscript>
      ${transcript.map((t: { offset: string; text: string }) => `[${t.offset}] ${t.text}`).join("\n")}

      <VideoTranscript/>

    ANALYSIS REQUIREMENTS:
      1. Create descriptive topic titles that capture the specific subject matter
      2. Include speaker identification when possible (e.g., "John Smith discusses...", "The interviewer asks about...")
      3. Summarize key points, recommendations, or conclusions for each topic
      4. Use searchable keywords in descriptions
      5. Break down longer discussions into subtopics when appropriate
      6. Format timestamps as MM:SS or HH:MM:SS (convert seconds over 59 to minutes)

    CRITICAL: Your response must be raw JSON only. Do not use code blocks, markdown formatting, or any wrapper text. Start your response immediately with the opening brace.

    Required JSON format: 
    {
      "topics": [
        {
          "timestamp": "HH:MM:SS",
          "topic": "Descriptive Topic Title",
          "description": "Brief summary of the topic, including key points and speaker identification if applicable",
          "keywords": ["keyword1", "keyword2", "keyword3"]
        }
      ]
    }

    EXAMPLE OUTPUT STRUCTURE:
{
  "topics": [
    {
      "timestamp": "02:15",
      "topic": "Clean Code Principles - Variable Naming Best Practices",
      "description": "Sarah Johnson Discusses of meaningful variable names, avoiding abbreviations, and using descriptive names that explain intent. Emphasizes readability over brevity.",
      "keywords": ["clean code", "variable naming", "readability", "best practices", "Sarah Johnson"]
    },
    {
      "timestamp": "05:30",
      "topic": "Code Review Process - Most Critical Practice According to Tech Lead",
      "description": "Mike Chen explains that thorough code reviews are the most important practice for maintaining code quality. Discusses review checklist and common pitfalls to avoid.",
      "keywords": ["code review", "Mike Chen", "most important practice", "tech lead", "quality", "checklist"]
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
    return new Response(
      JSON.stringify({
        error: "Failed to process video analysis",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
