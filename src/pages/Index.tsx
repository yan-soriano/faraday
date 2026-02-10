import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Film, Layers, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Reels Created", value: "0", icon: Film, change: "—" },
  { label: "Credits Used", value: "0 / 10", icon: TrendingUp, change: "Free tier" },
  { label: "Templates", value: "12", icon: Layers, change: "Available" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to ReelForge — your automated fashion Reel studio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={0} className="h-2" />
          <p className="text-sm text-muted-foreground">0 of 10 credits used this month</p>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="h-10 w-10 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Create Your First Reel</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Upload your fashion catalog, pick a template, and generate a cinematic Reel in minutes.
          </p>
          <Button size="lg" onClick={() => navigate("/generate")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Reel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
