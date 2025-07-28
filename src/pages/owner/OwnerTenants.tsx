import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Eye, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface Tenant {
  id: string;
  name: string;
  seat_limit: number;
  seats_used: number;
  status: string;
  logo_url?: string;
  created_at: string;
}

interface CreateTenantForm {
  name: string;
  seat_limit: number;
}

export const OwnerTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTenantSheetOpen, setIsTenantSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<CreateTenantForm>({
    defaultValues: {
      name: '',
      seat_limit: 50
    }
  });

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast({
        title: "Error",
        description: "Failed to load tenants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async (data: CreateTenantForm) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .insert([{
          name: data.name,
          seat_limit: data.seat_limit,
          seats_used: 0,
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tenant created successfully",
      });

      setIsCreateDialogOpen(false);
      form.reset();
      loadTenants();
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
    }
  };

  const openTenantSheet = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsTenantSheetOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenants & Admins</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tenant</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(createTenant)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tenant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seat_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seat Limit (1-2000)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={2000} 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Tenant</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Seats Allowed</TableHead>
                <TableHead>Seats Used</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.seat_limit}</TableCell>
                  <TableCell>{tenant.seats_used}</TableCell>
                  <TableCell>
                    {Math.round((tenant.seats_used / tenant.seat_limit) * 100)}%
                  </TableCell>
                  <TableCell>
                    <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openTenantSheet(tenant)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View / Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tenant Detail Sheet */}
      <Sheet open={isTenantSheetOpen} onOpenChange={setIsTenantSheetOpen}>
        <SheetContent className="w-[600px] sm:w-[600px]">
          <SheetHeader>
            <SheetTitle>{selectedTenant?.name} - Tenant Details</SheetTitle>
          </SheetHeader>
          {selectedTenant && (
            <div className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Seat Limit</Label>
                      <p className="text-sm font-medium">{selectedTenant.seat_limit}</p>
                    </div>
                    <div>
                      <Label>Seats Used</Label>
                      <p className="text-sm font-medium">{selectedTenant.seats_used}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge variant={selectedTenant.status === 'active' ? 'default' : 'secondary'}>
                        {selectedTenant.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Created</Label>
                      <p className="text-sm font-medium">
                        {new Date(selectedTenant.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Admin Management
                    <Button size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Admin
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Admin management will be implemented here. This would include:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>List of current admins</li>
                    <li>Add new admin functionality</li>
                    <li>Send magic links for account setup</li>
                    <li>Impersonate functionality</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};