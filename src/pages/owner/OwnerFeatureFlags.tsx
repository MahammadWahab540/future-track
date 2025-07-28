import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeatureFlag {
  id: string;
  flag_name: string;
  description: string;
  is_enabled: boolean;
  tenant_overrides: Record<string, any>;
  updated_at: string;
}

export const OwnerFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('flag_name');

      if (error) throw error;
      const formattedFlags = data?.map(flag => ({
        ...flag,
        tenant_overrides: (flag.tenant_overrides as Record<string, any>) || {}
      })) || [];
      setFlags(formattedFlags);
    } catch (error) {
      console.error('Error loading feature flags:', error);
      toast({
        title: "Error",
        description: "Failed to load feature flags",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatureFlag = async (flagId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ is_enabled: enabled })
        .eq('id', flagId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Feature flag ${enabled ? 'enabled' : 'disabled'}`,
      });

      loadFeatureFlags();
    } catch (error) {
      console.error('Error updating feature flag:', error);
      toast({
        title: "Error",
        description: "Failed to update feature flag",
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
        <h1 className="text-3xl font-bold">Feature Flags</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature Flag</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Global Toggle</TableHead>
                <TableHead>Tenant Overrides</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags.map((flag) => (
                <TableRow key={flag.id}>
                  <TableCell className="font-medium">{flag.flag_name}</TableCell>
                  <TableCell className="max-w-xs">{flag.description}</TableCell>
                  <TableCell>
                    <Badge variant={flag.is_enabled ? 'default' : 'secondary'}>
                      {flag.is_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={flag.is_enabled}
                      onCheckedChange={(checked) => toggleFeatureFlag(flag.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {Object.keys(flag.tenant_overrides || {}).length} overrides
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(flag.updated_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Flag Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Advanced feature flag management capabilities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Tenant-Specific Overrides</h3>
                <p className="text-sm text-muted-foreground">
                  Configure different feature flag states for individual tenants
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Scheduled Releases</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule feature flags to be enabled/disabled at specific times
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};