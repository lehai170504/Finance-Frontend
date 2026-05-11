import TransactionLogsClient from "./TransactionLogsClient";

export function generateStaticParams() {
  return [{ id: "index" }];
}

export default function Page() {
  return <TransactionLogsClient />;
}
