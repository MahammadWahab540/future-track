import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KPIData {
  activeTenants: number;
  totalStudents: number;
  seatsUsed: number;
  seatsAllowed: number;
  mostRequestedSkill: string;
}

interface SkillRequest {
  id: string;
  skill_name: string;
  description: string;
  requested_by: string;
  tenant_id: string;
  created_at: string;
}

export const OwnerDashboard = () => {
  const [kpis, setKpis] = useState<KPIData>({
    activeTenants: 0,
    totalStudents: 0,
    seatsUsed: 0,
    seatsAllowed: 0,
    mostRequestedSkill: 'N/A'
  });
  const [skillRequests, setSkillRequests] = useState<SkillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load KPIs
      const { data: tenants } = await supabase
        .from('tenants')
        .select('*')
        .eq('status', 'active');

      const activeTenants = tenants?.length || 0;
      const seatsUsed = tenants?.reduce((sum, tenant) => sum + tenant.seats_used, 0) || 0;
      const seatsAllowed = tenants?.reduce((sum, tenant) => sum + tenant.seat_limit, 0) || 0;

      // Load skill requests
      const { data: requests } = await supabase
        .from('skill_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Mock some data for demonstration
      setKpis({
        activeTenants,
        totalStudents: seatsUsed,
        seatsUsed,
        seatsAllowed,
        mostRequestedSkill: 'React Development'
      });

      setSkillRequests(requests || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveSkillRequest = async (requestId: string, skillName: string) => {
    try {
      // Create new skill
      const { data: newSkill, error: skillError } = await supabase
        .from('skills')
        .insert([{
          title: skillName,
          description: `Auto-created from skill request`,
          status: 'draft'
        }])
        .select()
        .single();

      if (skillError) throw skillError;

      // Update request status
      const { error: updateError } = await supabase
        .from('skill_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Skill "${skillName}" has been created and request approved`,
      });

      loadDashboardData();
    } catch (error) {
      console.error('Error approving skill request:', error);
      toast({
        title: "Error",
        description: "Failed to approve skill request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Tenant
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Skill
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeTenants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seat Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.seatsUsed} / {kpis.seatsAllowed}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.seatsAllowed > 0 ? Math.round((kpis.seatsUsed / kpis.seatsAllowed) * 100) : 0}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Requested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{kpis.mostRequestedSkill}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Skill Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Skill Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {skillRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pending skill requests</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skillRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.skill_name}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => approveSkillRequest(request.id, request.skill_name)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve & Create
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};