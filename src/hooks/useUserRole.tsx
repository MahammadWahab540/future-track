import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'owner' | 'admin' | 'student';

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole(null);
          setLoading(false);
          return;
        }

        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user role:', error);
          toast({
            title: "Error",
            description: "Failed to fetch user role",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // For now, set the first role found. In production, you might want more sophisticated logic
        const primaryRole = roles?.[0]?.role as UserRole || 'student';
        setUserRole(primaryRole);
      } catch (error) {
        console.error('Error in checkUserRole:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [toast]);

  return { userRole, loading };
};