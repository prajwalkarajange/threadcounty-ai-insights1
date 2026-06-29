import { BrainCircuit } from "lucide-react";
import { useRecentActivity } from "@/hooks/use-recent-activity";

export default function RecentActivity() {
  const { activities, loading } = useRecentActivity();

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6">

      <h2 className="text-xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((item) => (

          <div
            key={item.id}
            className="flex items-center gap-4 border-b pb-4"
          >

            <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">

              <BrainCircuit className="text-orange-500" />

            </div>

            <div className="flex-1">

              <p className="font-medium">
                AI analyzed
              </p>

              <p className="text-sm text-muted-foreground">

                {item.fabric_type}

              </p>

            </div>

            <div className="text-xs text-muted-foreground">

              {new Date(item.created_at).toLocaleDateString()}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}