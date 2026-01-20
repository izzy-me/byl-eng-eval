import { NextRequest, NextResponse} from "next/server";
import { getUserResults } from "@/lib/data/users";
import { isUserId } from "@/lib/types";

export async function GET(_req: NextRequest) {
    const url = new URL(_req.url);
    const userId = url.searchParams.get("userId");

    if(!userId || !isUserId(userId)) {
        return NextResponse.json(
            { error: "Missing userID"},
            {status: 400}
        );
    }
    
    const results = getUserResults(userId);

    if(!results) {
        return NextResponse.json(
            { error: "Results not found"},
            {status: 404}
        );
    }
    return NextResponse.json(results, {status: 200});
}