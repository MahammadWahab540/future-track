import React, { createContext, useContext, useState, useEffect } from 'react';

// Import mock data
import profileData from '../data/profile.json';
import skillsData from '../data/skills.json';
import roadmapsData from '../data/roadmaps.json';
import projectsData from '../data/projects.json';
import careerGoalsData from '../data/careerGoals.json';

export interface Profile {
  id: string;
  name: string;
  email: string;
  preferredLang: string;
  streak: number;
  hasSkills: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  careerGoal: string;
  level: string;
  progress: number;
  completedStages: number;
  totalStages: number;
  estimatedHours: number;
  icon: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  completed: boolean;
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  lessons: Lesson[];
}

export interface Roadmap {
  skillId: string;
  title: string;
  description: string;
  stages: Stage[];
}

export interface Project {
  id: string;
  skillId: string;
  title: string;
  description: string;
  fileURL: string | null;
  approved: boolean;
  submittedAt: string | null;
  reviewedAt: string | null;
  feedback: string | null;
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  
  // Profile
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  
  // Skills
  selectedSkills: Skill[];
  addSkill: (skill: Skill) => void;
  removeSkill: (skillId: string) => void;
  updateSkillProgress: (skillId: string, progress: number) => void;
  
  // Roadmaps
  roadmaps: Record<string, Roadmap>;
  getRoadmap: (skillId: string) => Roadmap | null;
  updateStageCompletion: (skillId: string, stageId: string, completed: boolean) => void;
  
  // Projects
  projects: Project[];
  submitProject: (project: Omit<Project, 'id' | 'submittedAt'>) => void;
  approveProject: (projectId: string) => void;
  
  // Career Goals
  careerGoals: CareerGoal[];
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile>(profileData as Profile);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(skillsData as Skill[]);
  const [roadmaps] = useState<Record<string, Roadmap>>(roadmapsData as Record<string, Roadmap>);
  const [projects, setProjects] = useState<Project[]>(projectsData as Project[]);
  const [careerGoals] = useState<CareerGoal[]>(careerGoalsData ? careerGoalsData as CareerGoal[] : []);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addSkill = (skill: Skill) => {
    if (selectedSkills.length < 3) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const updateSkillProgress = (skillId: string, progress: number) => {
    setSelectedSkills(prev => 
      prev.map(skill => 
        skill.id === skillId ? { ...skill, progress } : skill
      )
    );
  };

  const getRoadmap = (skillId: string): Roadmap | null => {
    return roadmaps[skillId] || null;
  };

  const updateStageCompletion = (skillId: string, stageId: string, completed: boolean) => {
    // In a real app, this would update the backend
    console.log(`Stage ${stageId} in skill ${skillId} marked as ${completed ? 'completed' : 'incomplete'}`);
  };

  const submitProject = (projectData: Omit<Project, 'id' | 'submittedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const approveProject = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, approved: true, reviewedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const value: AppContextType = {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    updateProfile,
    selectedSkills,
    addSkill,
    removeSkill,
    updateSkillProgress,
    roadmaps,
    getRoadmap,
    updateStageCompletion,
    projects,
    submitProject,
    approveProject,
    careerGoals,
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};