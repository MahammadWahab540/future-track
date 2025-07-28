import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Trophy,
  Star,
  Target,
  Calendar,
  Clock,
  Award,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Book
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile, selectedSkills, projects } = useApp();
  const [activeTab, setActiveTab] = useState('skills');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalProgress = selectedSkills.reduce((acc, skill) => acc + skill.progress, 0) / selectedSkills.length || 0;
  const completedSkills = selectedSkills.filter(skill => skill.progress === 100).length;
  const approvedProjects = projects.filter(project => project.approved).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold gradient-text">Profile</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
                <p className="text-muted-foreground mb-4">{profile.email}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-semibold">{Math.round(totalProgress)}%</span>
                  </div>
                  <Progress value={totalProgress} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-primary">{profile.streak}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-secondary">{completedSkills}</div>
                      <div className="text-xs text-muted-foreground">Skills Mastered</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Joined</span>
                  </div>
                  <span>Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Study Time</span>
                  </div>
                  <span>47h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span>Projects</span>
                  </div>
                  <span>{approvedProjects}/{projects.length}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Learning Paths</CardTitle>
                    <CardDescription>
                      Your selected skills and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedSkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{skill.name}</h3>
                            <Badge variant="outline" className="capitalize">
                              {skill.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {skill.careerGoal}
                          </p>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{skill.progress}%</span>
                          </div>
                          <Progress value={skill.progress} className="h-2" />
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/roadmap/${skill.id}`)}
                          className="ml-4"
                        >
                          View Roadmap
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Trophy className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Streak Master</CardTitle>
                          <CardDescription>7 day learning streak</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Star className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Fast Learner</CardTitle>
                          <CardDescription>Completed 3 stages this week</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Quiz Champion</CardTitle>
                          <CardDescription>90%+ average quiz score</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Book className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Knowledge Seeker</CardTitle>
                          <CardDescription>Completed 20+ lessons</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Capstone Projects</CardTitle>
                    <CardDescription>
                      Your submitted projects and their review status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{project.title}</h3>
                                <Badge 
                                  variant={project.approved ? "default" : "secondary"}
                                  className={project.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                                >
                                  {project.approved ? (
                                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</>
                                  ) : (
                                    <><AlertCircle className="w-3 h-3 mr-1" /> Pending Review</>
                                  )}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {project.description}
                              </p>
                              {project.submittedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Submitted: {new Date(project.submittedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No projects submitted yet</p>
                        <p className="text-sm text-muted-foreground">
                          Complete all stages in a skill to unlock capstone projects
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resume Tab */}
              <TabsContent value="resume" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Resume</CardTitle>
                    <CardDescription>
                      Showcase your completed skills and certifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Skills Mastered</h3>
                        {completedSkills > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {selectedSkills
                              .filter(skill => skill.progress === 100)
                              .map((skill) => (
                                <Badge key={skill.id} variant="outline" className="px-3 py-2">
                                  <CheckCircle2 className="w-3 h-3 mr-2 text-green-600" />
                                  {skill.name}
                                </Badge>
                              ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            Complete skills to add them to your resume
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Approved Projects</h3>
                        {approvedProjects > 0 ? (
                          <div className="space-y-2">
                            {projects
                              .filter(project => project.approved)
                              .map((project) => (
                                <div key={project.id} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span>{project.title}</span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            No approved projects yet
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="btn-gradient flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;