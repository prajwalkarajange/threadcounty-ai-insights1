import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="rounded-xl bg-thread/10 p-4">
          <Icon className="text-thread" size={30} />
        </div>

      </div>

    </div>
  );
}