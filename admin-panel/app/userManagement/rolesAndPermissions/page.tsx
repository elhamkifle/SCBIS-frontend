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
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

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
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"create" | "edit">("create");

  const handleCreateRole = () => {
    const updated = [...roles, { ...newRole, id: roles.length + 1 }];
    setRoles(updated);
    setNewRole({ name: "", description: "", permissions: [] });
    setOpenDialog(false);
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;
    
    const updated = roles.map(role => 
      role.id === editingRole.id ? editingRole : role
    );
    setRoles(updated);
    setEditingRole(null);
    setOpenDialog(false);
  };

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const togglePermission = (perm: string, isEditing: boolean = false) => {
    if (isEditing && editingRole) {
      setEditingRole(prev => {
        if (!prev) return null;
        const exists = prev.permissions.includes(perm);
        const updatedPerms = exists
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm];
        return { ...prev, permissions: updatedPerms };
      });
    } else {
      setNewRole(prev => {
        const exists = prev.permissions.includes(perm);
        const updatedPerms = exists
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm];
        return { ...prev, permissions: updatedPerms };
      });
    }
  };

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setDialogType("edit");
    setOpenDialog(true);
  };

  const openCreateDialog = () => {
    setNewRole({ name: "", description: "", permissions: [] });
    setDialogType("create");
    setOpenDialog(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Roles & Permissions</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Add Role</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-4">
                {dialogType === "create" ? "Create New Role" : "Edit Role"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Role Name</Label>
                <Input
                  value={dialogType === "edit" ? editingRole?.name || "" : newRole.name}
                  onChange={(e) => 
                    dialogType === "edit" 
                      ? setEditingRole(prev => prev ? {...prev, name: e.target.value} : null)
                      : setNewRole({ ...newRole, name: e.target.value })
                  }
                  placeholder="e.g. Claims Officer"
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Input
                  value={dialogType === "edit" ? editingRole?.description || "" : newRole.description}
                  onChange={(e) => 
                    dialogType === "edit"
                      ? setEditingRole(prev => prev ? {...prev, description: e.target.value} : null)
                      : setNewRole({ ...newRole, description: e.target.value })
                  }
                  placeholder="Short description"
                />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Assign Permissions</h3>
                {Object.entries(mockPermissions).map(([group, perms]) => (
                  <div key={group} className="mb-4 p-3 border rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">{group}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map((perm) => (
                        <Label key={perm} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                          <Checkbox
                            checked={
                              dialogType === "edit" 
                                ? editingRole?.permissions.includes(perm) || false
                                : newRole.permissions.includes(perm)
                            }
                            onCheckedChange={() => togglePermission(perm, dialogType === "edit")}
                          />
                          <span className="capitalize">{perm.replace(/_/g, " ")}</span>
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={dialogType === "create" ? handleCreateRole : handleUpdateRole}
                disabled={
                  dialogType === "create" 
                    ? !newRole.name.trim() 
                    : !editingRole?.name.trim()
                }
              >
                {dialogType === "create" ? "Create Role" : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list">Roles Overview</TabsTrigger>
          <TabsTrigger value="assign">Assign Roles to Users</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 text-gray-500 hover:text-primary"
                        onClick={() => openEditDialog(role)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 text-gray-500 hover:text-destructive"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((p, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline"
                          className="text-xs capitalize"
                        >
                          {p.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assign">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Assign Users to Roles</CardTitle>
              <p className="text-sm text-gray-600">Search for users and assign them to different roles</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email or Phone Number</Label>
                <Input placeholder="user@example.com or 09..." className="max-w-md" />
              </div>
              <div className="space-y-2">
                <Label>Select Role</Label>
                <select className="border rounded px-3 py-2 max-w-md w-full">
                  {roles.map((r) => (
                    <option key={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <Button>Assign Role</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}