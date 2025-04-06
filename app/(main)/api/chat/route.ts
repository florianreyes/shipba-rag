import { searchUsersWithContext } from "@/lib/ai/context_search";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, workspaceId } = await req.json();
  
  // Extract the user's last message
  const lastMessage = messages[messages.length - 1];
  const userQuery = lastMessage.content;
  

  try {
    // Directly search for users using the CAG approach with the original query
    const results = await searchUsersWithContext(userQuery, workspaceId);

    // Return the results
    return Response.json({ persons: results });
  } catch (error) {
    return Response.json(
      { error: "No se pudo procesar tu solicitud" },
      { status: 500 }
    );
  }
}
