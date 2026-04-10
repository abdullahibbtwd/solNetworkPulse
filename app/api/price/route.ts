import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true",
      { next: { revalidate: 10 } } // Cache for 10 seconds to avoid spamming CG
    );
    const data = await res.json();
    
    if (data?.solana?.usd) {
      return NextResponse.json({ 
        price: data.solana.usd,
        change24h: data.solana.usd_24h_change
      });
    }
    
    return NextResponse.json({ error: "Price data missing" }, { status: 502 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 });
  }
}
