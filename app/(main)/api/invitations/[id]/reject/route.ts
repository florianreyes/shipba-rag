import { NextRequest, NextResponse } from "next/server";
import { respondToInvitation } from "@/lib/actions/workspaces";
import { getCurrentUser } from "@/lib/actions/auth";

// Define the handler without any type for the context to avoid type errors
export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const invitationId = params.id;
    
    const result = await respondToInvitation(
      invitationId,
      user.id,
      false // reject
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    return NextResponse.json(
      { error: "Failed to reject invitation" },
      { status: 500 }
    );
  }
} 