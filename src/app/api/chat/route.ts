import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    //console.log("The question is: ", body);
    console.log("Last question is: ", body[body.length - 1].content);
    const lastQuestion = body[body.length - 1].content;
    //add in ai agent to process the question
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `You are a helpful AI assistant. Answer the user's question
    User's question: ${lastQuestion}
    Please provide a concise and informative answer.`;
    const result = await model.generateContent([prompt]);
    const aiResponse = result.response.text();
    console.log("AI Response:", aiResponse);
    console.log("jas");

    return new Response(aiResponse, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the request." }),
      { status: 500 }
    );
  }
}
