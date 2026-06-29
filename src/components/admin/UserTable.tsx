import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";

import { useUsers } from "@/hooks/use-users";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserTable() {
  const { users, loading, deleteUser } = useUsers();

  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = search.toLowerCase();

      return user.full_name?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q);
    });
  }, [users, search]);

  if (loading) {
    return <div className="rounded-xl border bg-card p-10 text-center">Loading users...</div>;
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Registered Users</h2>

          <p className="text-muted-foreground">Total Users : {filteredUsers.length}</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-10"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Role</TableHead>

            <TableHead>Joined</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url ?? ""} />

                    <AvatarFallback>{user.full_name?.charAt(0) ?? "U"}</AvatarFallback>
                  </Avatar>

                  <span className="font-medium">{user.full_name || "Unknown"}</span>
                </div>
              </TableCell>

              <TableCell>{user.email}</TableCell>

              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
              </TableCell>

              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Delete this user?")) {
                      deleteUser(user.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
