import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SettingsPage = () => (
  <div className="space-y-8 max-w-5xl">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
    </div>

    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Settings className="h-10 w-10 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Account settings, profile management, and API key configuration will be available here.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default SettingsPage;
