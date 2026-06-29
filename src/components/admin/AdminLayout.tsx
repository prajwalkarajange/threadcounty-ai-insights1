import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <AdminSidebar />

        {/* Right Section */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Top Header */}
          <AdminHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-muted/30 p-6 md:p-8">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}