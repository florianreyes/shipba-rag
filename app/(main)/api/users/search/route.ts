import { NextRequest, NextResponse } from "next/server";
import { searchUsersByEmail } from "@/lib/actions/workspaces";
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
    
    const query = req.nextUrl.searchParams.get("query");
    
    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: "Search query must be at least 3 characters" },
        { status: 400 }
      );
    }
    
    // The searchUsersByEmail function will now only return users who are:
    // 1. Matching the email query pattern
    // 2. Have 'active' status in workspace_users
    // It will filter out users with 'rejected' or 'invited' status
    const users = await searchUsersByEmail(query);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
} 