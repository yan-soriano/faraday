import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    current: true,
    features: ["1 Reel/month", "2-3 AI images", "Basic templates", "720p", "Watermark"],
  },
  {
    name: "Basic",
    price: "$15/mo",
    current: false,
    features: ["10 Reels/month", "10 AI images", "All templates", "1080p", "No watermark"],
  },
  {
    name: "Pro",
    price: "$45/mo",
    current: false,
    features: ["Unlimited Reels", "10+ AI images", "All + custom templates", "1080p", "No watermark"],
  },
];

const Subscription = () => (
  <div className="space-y-8 max-w-5xl">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
      <p className="text-muted-foreground mt-1">Manage your plan and billing.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              {plan.current && <Badge>Current</Badge>}
            </div>
            <CardDescription className="text-2xl font-bold">{plan.price}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            {!plan.current && (
              <Button className="w-full mt-4" variant="outline">
                Upgrade
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Subscription;
