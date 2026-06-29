import { createFileRoute } from "@tanstack/react-router";
import UserTable from "@/components/admin/UserTable";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <p className="text-muted-foreground">
          Manage all registered users
        </p>
      </div>

      <UserTable />

    </div>
  );
}