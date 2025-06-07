export async function POST(req: Request) {
  const body = await req.json();
  console.log("The question is: ", body);
  return new Response(
    JSON.stringify({
      answer: "This is a mock response. Please implement the actual logic.",
    })
  );
}
