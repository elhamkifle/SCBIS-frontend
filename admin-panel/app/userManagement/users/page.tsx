"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import withAuth from "../../utils/withAuth";
import { userApi, User } from "../../services/api";

function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async (searchQuery = "") => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userApi.getUsers({
        search: searchQuery || undefined,
        limit: 50 // Adjust as needed
      });
      
      // Map the backend response to match frontend expectations
      const mappedUsers = response.users.map(user => ({
        ...user,
        name: user.name,
        phone: user.phone,
        joined: new Date().toISOString().split('T')[0], // You might want to add this field to backend
        status: (user.status || "Active") as "Active" | "Blocked" | "Suspended"
      }));
      
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== undefined) {
        fetchUsers(search);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Handle user actions (suspend/activate)
  const handleUserAction = async (userId: string, action: "suspend" | "activate") => {
    setActionLoading(userId);
    
    try {
      if (action === "suspend") {
        await userApi.suspendUser(userId);
      } else {
        await userApi.activateUser(userId);
      }
      
      // Refresh the users list
      await fetchUsers(search);
      
      // Close dialog if the user being acted upon is currently selected
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      alert(`Failed to ${action} user: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users;

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Users</p>
              <p className="mt-2">{error}</p>
              <Button 
                onClick={() => fetchUsers(search)} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80"
              disabled={loading}
            />
          </div>

          <ScrollArea className="max-h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Policies</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      {search ? "No users found matching your search." : "No users found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : user.status === "Blocked"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>{user.policyCount}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            disabled={loading}
                          >
                            View
                          </Button>
                          <Button
                            variant={user.status === "Active" ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleUserAction(
                              user.id, 
                              user.status === "Active" ? "suspend" : "activate"
                            )}
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id 
                              ? "..." 
                              : user.status === "Active" 
                                ? "Suspend" 
                                : "Activate"
                            }
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedUser.name}</DialogTitle>
              <p className="text-sm text-gray-500">User ID: {selectedUser.id}</p>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Policies:</strong> {selectedUser.policyCount}</p>
              <p><strong>Joined:</strong> {selectedUser.joined}</p>
            </div>
            <DialogFooter className="mt-4">
              <Link href={`/userManagement/users/${selectedUser.id}`} passHref>
                <Button variant="secondary">View More</Button>
              </Link>
              <Button onClick={() => setSelectedUser(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default withAuth(UsersPage);