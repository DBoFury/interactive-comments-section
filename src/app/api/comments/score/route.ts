import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  return NextResponse.json({ message: "Hi!" }, { status: 200 });
};