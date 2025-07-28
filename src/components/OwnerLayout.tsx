import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Settings, Users, BookOpen, Flag, BarChart3, HeadphonesIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OwnerLayoutProps {
  children: ReactNode;
}

export const OwnerLayout = ({ children }: OwnerLayoutProps) => {
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('tenants')) return 'tenants';
    if (path.includes('skills')) return 'skills';
    if (path.includes('feature-flags')) return 'feature-flags';
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('support')) return 'support';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">SkillForge Owner Console</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <Tabs value={getCurrentTab()} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
              <TabsTrigger asChild value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link to="/owner/dashboard" className="flex items-center gap-2 px-4 py-3">
                  <Settings className="h-4 w-4" />
                  Dashboard
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="tenants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link to="/owner/tenants" className="flex items-center gap-2 px-4 py-3">
                  <Users className="h-4 w-4" />
                  Tenants
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link to="/owner/skills" className="flex items-center gap-2 px-4 py-3">
                  <BookOpen className="h-4 w-4" />
                  Skills
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="feature-flags" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link to="/owner/feature-flags" className="flex items-center gap-2 px-4 py-3">
                  <Flag className="h-4 w-4" />
                  Features
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link to="/owner/analytics" className="flex items-center gap-2 px-4 py-3">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="support" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Link to="/owner/support" className="flex items-center gap-2 px-4 py-3">
                  <HeadphonesIcon className="h-4 w-4" />
                  Support
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};