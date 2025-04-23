'use client';
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PermissionGroup {
  [key: string]: string[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

const mockPermissions: PermissionGroup = {
  Users: ["view_users", "edit_users", "delete_users"],
  Policies: ["view_policies", "approve_policies", "assign_policies"],
  Claims: ["view_claims", "approve_claims", "reject_claims"],
  Settings: ["configure_premium", "manage_roles"],
};

const initialRoles: Role[] = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to the system",
    permissions: Object.values(mockPermissions).flat(),
  },
  {
    id: 2,
    name: "Underwriter",
    description: "Can review and approve policies",
    permissions: ["view_policies", "approve_policies"],
  },
  {
    id: 3,
    name: "Employee",
    description: "Regular staff with limited access",
    permissions: ["view_users", "view_policies"],
  },
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({
    name: "",
    description: "",
    permissions: []
  });
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [open, setOpen] = useState(false);

  const handleCreateRole = () => {
    const updated = [...roles, { ...newRole, id: roles.length + 1 }];
    setRoles(updated);
    setNewRole({ name: "", description: "", permissions: [] });
    setOpen(false);
  };

  const togglePermission = (perm: string) => {
    setNewRole((prev) => {
      const exists = prev.permissions.includes(perm);
      const updatedPerms = exists
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: updatedPerms };
    });
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Roles & Permissions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Role</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-4">Create New Role</DialogTitle>
            </DialogHeader>
            <Label>Role Name</Label>
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="e.g. Claims Officer"
            />
            <Label className="mt-4">Description</Label>
            <Input
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              placeholder="Short description"
            />
            <div className="mt-4">
              <h3 className="font-medium mb-2">Assign Permissions</h3>
              {Object.entries(mockPermissions).map(([group, perms]) => (
                <div key={group} className="mb-2">
                  <h4 className="font-semibold text-gray-700 mb-1">{group}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <Label key={perm} className="flex items-center gap-2">
                        <Checkbox
                          checked={newRole.permissions.includes(perm)}
                          onCheckedChange={() => togglePermission(perm)}
                        />
                        {perm.replace(/_/g, " ")}
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleCreateRole}>Save Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Roles Overview</TabsTrigger>
          <TabsTrigger value="assign">Assign Roles to Users</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-xl transition">
                <CardHeader>
                  <CardTitle>{role.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{role.description}</p>
                  <h4 className="font-semibold text-sm text-gray-500">Permissions</h4>
                  <ul className="text-sm text-gray-700 list-disc list-inside">
                    {role.permissions.map((p, idx) => (
                      <li key={idx}>{p.replace(/_/g, " ")}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assign">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Assign Users to Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Email or Phone Number</Label>
              <Input placeholder="user@example.com or 09..." />
              <Label>Select Role</Label>
              <select className="border rounded px-3 py-2 w-full">
                {roles.map((r) => (
                  <option key={r.id}>{r.name}</option>
                ))}
              </select>
              <div className="flex justify-end mt-4">
                <Button>Assign</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
