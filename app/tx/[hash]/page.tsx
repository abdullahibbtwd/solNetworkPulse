import { TxView } from "@/components/tx/tx-view";

export default async function TxPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  return <TxView hash={hash} />;
}
