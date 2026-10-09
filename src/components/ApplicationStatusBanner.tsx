import { AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "../context/contexts";

export function useApplicationStatus() {
  const { user } = useAuth();
  if (!user || (user.role !== "retailer" && user.role !== "wholesaler")) return null;
  if (user.status === "pending_approval") return "pending" as const;
  if (user.status === "suspended") return "rejected" as const;
  return null;
}

export function ApplicationStatusBanner() {
  const state = useApplicationStatus();
  if (!state) return null;

  if (state === "pending") {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        <Clock className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-bold">Your business account is pending approval</p>
          <p className="mt-1">
            You'll see standard pricing and won't be able to place orders until our team approves
            your application. We'll notify you by email as soon as it's reviewed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-bold">Your business application was not approved</p>
        <p className="mt-1">
          This account has been suspended and can't be used to browse tier pricing or place
          orders. Please contact support if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
}
