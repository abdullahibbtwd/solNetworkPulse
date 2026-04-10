import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.HELIUS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "HELIUS_API_KEY is not set in environment variables." }, { status: 500 });
  }

  // Use the standard Helius WebSocket URL
  const wsUrl = `wss://mainnet.helius-rpc.com/?api-key=${apiKey}`;

  return NextResponse.json({ url: wsUrl });
}
