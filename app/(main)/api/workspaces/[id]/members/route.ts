import { NextRequest, NextResponse } from "next/server";
import { getWorkspaceMembers } from "@/lib/actions/workspaces";
import { getCurrentUser } from "@/lib/actions/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const members = await getWorkspaceMembers(id);
    
    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace members" },
      { status: 500 }
    );
  }
} 