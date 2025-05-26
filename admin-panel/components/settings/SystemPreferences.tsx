import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SystemPreferences({ formData, updateForm }: any) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">System Preferences</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Language</Label>
            <Input
              value={formData.language}
              onChange={(e) => updateForm("language", e.target.value)}
            />
          </div>
          <div>
            <Label>Time Zone</Label>
            <Input
              value={formData.timezone}
              onChange={(e) => updateForm("timezone", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}