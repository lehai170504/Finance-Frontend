import GroupLogsClient from "./GroupLogsClient";

export function generateStaticParams() {
  return [{ id: "index" }];
}

export default function Page() {
  return <GroupLogsClient />;
}
