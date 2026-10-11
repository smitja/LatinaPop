import { adminCopy } from "@/lib/copy/admin";

export default function AdminHomePage() {
  return (
    <div className="grid max-w-3xl gap-3">
      <h1 className="text-2xl">{adminCopy.dashboardTitle}</h1>
      <p className="text-sm text-muted">{adminCopy.dashboardIntro}</p>
    </div>
  );
}
