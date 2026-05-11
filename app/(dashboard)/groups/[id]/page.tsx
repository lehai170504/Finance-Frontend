import GroupDetailClient from "./GroupDetailClient";

export function generateStaticParams() {
  return [{ id: "index" }];
}

export default function Page() {
  return <GroupDetailClient />;
}
