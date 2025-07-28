import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Youtube, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface Skill {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'live';
  stages_count?: number;
  updated_at: string;
}

interface CreateSkillForm {
  title: string;
  description: string;
}

export const OwnerSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<CreateSkillForm>({
    defaultValues: {
      title: '',
      description: ''
    }
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          stages(count)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const skillsWithCounts = data?.map(skill => ({
        id: skill.id,
        title: skill.title,
        description: skill.description || '',
        status: skill.status as 'draft' | 'live',
        updated_at: skill.updated_at,
        stages_count: skill.stages?.length || 0
      })) || [];

      setSkills(skillsWithCounts);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSkill = async (data: CreateSkillForm) => {
    try {
      const { error } = await supabase
        .from('skills')
        .insert([{
          title: data.title,
          description: data.description,
          status: 'draft'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skill created successfully",
      });

      setIsCreateDialogOpen(false);
      form.reset();
      loadSkills();
    } catch (error) {
      console.error('Error creating skill:', error);
      toast({
        title: "Error",
        description: "Failed to create skill",
        variant: "destructive",
      });
    }
  };

  const toggleSkillStatus = async (skillId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'draft' ? 'live' : 'draft';
      
      const { error } = await supabase
        .from('skills')
        .update({ status: newStatus })
        .eq('id', skillId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Skill status updated to ${newStatus}`,
      });

      loadSkills();
    } catch (error) {
      console.error('Error updating skill status:', error);
      toast({
        title: "Error",
        description: "Failed to update skill status",
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
        <h1 className="text-3xl font-bold">Skills & Stages</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Skill</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(createSkill)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter skill title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter skill description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Skill</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No skills created yet</p>
              <Button 
                className="mt-4" 
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Create Your First Skill
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill Name</TableHead>
                  <TableHead># of Stages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.title}</TableCell>
                    <TableCell>{skill.stages_count || 0}</TableCell>
                    <TableCell>
                      <Badge variant={skill.status === 'live' ? 'default' : 'secondary'}>
                        {skill.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(skill.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleSkillStatus(skill.id, skill.status)}
                        >
                          {skill.status === 'draft' ? 'Publish' : 'Unpublish'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Skill Builder Wizard would go here */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Builder Wizard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The comprehensive skill builder wizard will include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Step 1: Basic Info</h3>
                <p className="text-sm text-muted-foreground">
                  Title, description, and tenant visibility settings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Youtube className="mr-2 h-4 w-4" />
                  Step 2: Stage Builder
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag-and-drop stages with YouTube URLs, capstone rubrics
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Step 3: AI Content
                </h3>
                <p className="text-sm text-muted-foreground">
                  Auto-generate articles, quizzes, and chatbot prompts
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};