import { NextRequest, NextResponse } from "next/server";
import { getWorkspacePendingInvitations } from "@/lib/actions/workspaces";
import { getCurrentUser } from "@/lib/actions/auth";

export async function GET(
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
    const invitations = await getWorkspacePendingInvitations(workspaceId);
    
    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Error fetching workspace invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace invitations" },
      { status: 500 }
    );
  }
} 