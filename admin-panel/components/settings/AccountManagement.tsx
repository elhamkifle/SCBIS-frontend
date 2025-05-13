import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountManagement({
  onDeleteClick,
}: {
  onDeleteClick: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Account Management</h2>
        <p className="text-gray-600">
          Deleting your account is irreversible. All associated data will be permanently removed.
        </p>
        <Button variant="destructive" onClick={onDeleteClick}>
          Delete My Account
        </Button>
      </CardContent>
    </Card>
  );
}
