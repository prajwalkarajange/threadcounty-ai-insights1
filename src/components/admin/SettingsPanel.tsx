import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Cpu, ShieldCheck, Users } from "lucide-react";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

export default function SettingsPanel() {
  const stats = useAdminDashboard();

  return (
    <div className="grid gap-6">

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-between">
            <span>Project</span>
            <Badge>ThreadCounty AI</Badge>
          </div>

          <div className="flex justify-between">
            <span>Version</span>
            <Badge>v1.0.0</Badge>
          </div>

          <div className="flex justify-between">
            <span>AI Model</span>
            <Badge>Gemini</Badge>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Database size={18}/>
              Database
            </div>

            <Badge className="bg-green-600">
              Connected
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Cpu size={18}/>
              AI Service
            </div>

            <Badge className="bg-green-600">
              Online
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <ShieldCheck size={18}/>
              Authentication
            </div>

            <Badge className="bg-green-600">
              Secure
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Users size={18}/>
              Registered Users
            </div>

            <Badge>
              {stats.users}
            </Badge>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}