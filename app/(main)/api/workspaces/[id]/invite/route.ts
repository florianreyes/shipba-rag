import { NextRequest, NextResponse } from "next/server";
import { inviteUserToWorkspace } from "@/lib/actions/workspaces";
import { getCurrentUser } from "@/lib/actions/auth";

export async function POST(
  req: NextRequest,
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
    
    const workspaceId = params.id;
    const { email, isAdmin } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    const result = await inviteUserToWorkspace(
      workspaceId,
      email,
      user.id,
      isAdmin
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
} 