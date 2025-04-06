import { NextRequest, NextResponse } from "next/server";
import { removeUserFromWorkspace } from "@/lib/actions/workspaces";
import { getCurrentUser } from "@/lib/actions/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Await params before accessing properties
    const { id, userId } = await params;
    
    const result = await removeUserFromWorkspace(
      id,
      userId,
      user.id
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Error removing user from workspace:", error);
    return NextResponse.json(
      { error: "Failed to remove user from workspace" },
      { status: 500 }
    );
  }
} 