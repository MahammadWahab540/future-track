
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Target, Code, BarChart, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const availableSkills = [
  { id: 'sql', name: 'SQL', icon: '🗃️', description: 'Database querying and management' },
  { id: 'python', name: 'Python', icon: '🐍', description: 'Programming and data analysis' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', description: 'Web development and programming' },
  { id: 'react', name: 'React', icon: '⚛️', description: 'Frontend framework' },
  { id: 'tableau', name: 'Tableau', icon: '📊', description: 'Data visualization' },
  { id: 'excel', name: 'Excel', icon: '📈', description: 'Spreadsheet analysis' },
  { id: 'machine-learning', name: 'Machine Learning', icon: '🤖', description: 'AI and predictive modeling' },
  { id: 'aws', name: 'AWS', icon: '☁️', description: 'Cloud computing platform' },
];

const SelectPathPage = () => {
  const navigate = useNavigate();
  const { updateProfile, careerGoals = [] } = useApp();
  const [selectedCareerGoal, setSelectedCareerGoal] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isCareerGoalOpen, setIsCareerGoalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSkillToggle = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(prev => prev.filter(id => id !== skillId));
    } else if (selectedSkills.length < 3) {
      setSelectedSkills(prev => [...prev, skillId]);
    } else {
      toast({
        title: 'Maximum skills reached',
        description: 'You can select up to 3 skills at a time.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedCareerGoal || selectedSkills.length === 0 || !selectedLevel || !selectedLanguage) {
      toast({
        title: 'Please complete all fields',
        description: 'All fields are required to create your learning path.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProfile({
        hasSkills: true,
        preferredLang: selectedLanguage,
      });
      
      toast({
        title: 'Learning path created!',
        description: 'Generating your personalized roadmap...',
      });
      
      navigate('/loading');
    } catch (error) {
      toast({
        title: 'Error creating path',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full mb-4"
          >
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Choose Your Path</h1>
          <p className="text-muted-foreground">
            Let's create a personalized learning journey tailored to your goals
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Setup Your Learning Profile</CardTitle>
            <CardDescription>
              This information helps us create the perfect roadmap for your success
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Career Goal Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Career Goal</label>
              <Popover open={isCareerGoalOpen} onOpenChange={setIsCareerGoalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCareerGoalOpen}
                    className="w-full justify-between"
                  >
                    {selectedCareerGoal
                      ? careerGoals.find(goal => goal.id === selectedCareerGoal)?.title
                      : "Select career goal..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search career goals..." />
                    <CommandList>
                      <CommandEmpty>No career goal found.</CommandEmpty>
                      <CommandGroup>
                        {careerGoals && careerGoals.length > 0 ? careerGoals.map((goal) => (
                          <CommandItem
                            key={goal.id}
                            onSelect={() => {
                              setSelectedCareerGoal(goal.id);
                              setIsCareerGoalOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedCareerGoal === goal.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div>
                              <div className="font-medium">{goal.title}</div>
                              <div className="text-sm text-muted-foreground">{goal.description}</div>
                            </div>
                          </CommandItem>
                        )) : (
                          <CommandItem disabled>Loading career goals...</CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Skills Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Skills to Learn (Max 3) 
                <span className="text-muted-foreground ml-2">
                  {selectedSkills.length}/3 selected
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedSkills.includes(skill.id)
                          ? 'ring-2 ring-brand-primary bg-brand-primary/5'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleSkillToggle(skill.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{skill.icon}</span>
                          <div>
                            <div className="font-medium">{skill.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {skill.description}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSkills.map((skillId) => {
                    const skill = availableSkills.find(s => s.id === skillId);
                    return (
                      <Badge key={skillId} variant="secondary" className="px-3 py-1">
                        {skill?.icon} {skill?.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Current Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Beginner - New to programming/tech
                    </div>
                  </SelectItem>
                  <SelectItem value="intermediate">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      Intermediate - Some experience
                    </div>
                  </SelectItem>
                  <SelectItem value="advanced">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Advanced - Experienced professional
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Language */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">🇺🇸 English</SelectItem>
                  <SelectItem value="telugu">🇮🇳 Telugu</SelectItem>
                  <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                  <SelectItem value="tamil">🇮🇳 Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !selectedCareerGoal || selectedSkills.length === 0 || !selectedLevel || !selectedLanguage}
                className="w-full btn-gradient py-3 text-lg"
              >
                {isLoading ? 'Creating Your Path...' : 'Create My Learning Path'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SelectPathPage;
