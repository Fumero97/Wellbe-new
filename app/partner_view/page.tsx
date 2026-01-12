import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnerViewPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Partner View</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Benvenuto nella dashboard partner (Mock).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
