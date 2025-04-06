import { NextRequest, NextResponse } from "next/server";
import { getUserInvitations } from "@/lib/actions/workspaces";
import { getCurrentUser } from "@/lib/actions/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const invitations = await getUserInvitations(user.id);
    
    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
} 