'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogTitle } from '@/components/ui/dialog';

export interface ClassTemplate {
  id: string;
  name: string;
  danceType: string;
  duration: number; // in hours
  maxParticipants: number;
  description?: string;
}

interface TemplateLibraryListProps {
  onSelectTemplate: (template: ClassTemplate) => void;
  selectedTemplate?: ClassTemplate | null;
}

// Mock templates - this would come from an API or database
const mockTemplates: ClassTemplate[] = [
  {
    id: '1',
    name: 'Salsa Beginner',
    danceType: 'salsa',
    duration: 1,
    maxParticipants: 50,
    description: 'Perfect introduction to salsa dancing with basic steps and timing'
  },
  {
    id: '3',
    name: 'Salsa Advanced Beginner',
    danceType: 'salsa',
    duration: 1,
    maxParticipants: 12,
    description: 'Build on your salsa skills with more complex turns and styling'
  },
  {
    id: '4',
    name: 'Salsa Intermediate 1',
    danceType: 'salsa',
    duration: 1,
    maxParticipants: 35,
    description: 'Explore intermediate salsa moves and partner work'
  },
  {
    id: '5',
    name: 'Salsa Intermediate 2',
    danceType: 'salsa',
    duration: 1,
    maxParticipants: 25,
    description: 'Take your salsa dancing to the next level with advanced techniques and styling'
  },
  {
    id: '2',
    name: 'Bachata Basics',
    danceType: 'bachata',
    duration: 1,
    maxParticipants: 50,
    description: 'Learn the fundamentals of bachata with simple side-to-side steps'
  },
  {
    id: '6',
    name: 'Bachata Intermediate',
    danceType: 'bachata',
    duration: 1,
    maxParticipants: 30,
    description: 'Build on your bachata skills with turns and body movement'
  },
  {
    id: '7',
    name: 'Bachata Advanced',
    danceType: 'bachata',
    duration: 1,
    maxParticipants: 20,
    description: 'Master advanced bachata techniques and styling'
  },
  {
    id: '8',
    name: 'Merengue Basics',
    danceType: 'merengue',
    duration: 1,
    maxParticipants: 40,
    description: 'Learn the fundamentals of merengue with basic steps'
  },
  {
    id: '9',
    name: 'Merengue Intermediate',
    danceType: 'merengue',
    duration: 1,
    maxParticipants: 30,
    description: 'Build on your merengue skills with turns and styling'
  },
  {
    id: '10',
    name: 'Kizomba Basics',
    danceType: 'kizomba',
    duration: 1.5,
    maxParticipants: 25,
    description: 'Introduction to the sensual movements of kizomba'
  },
  {
    id: '11',
    name: 'Kizomba Intermediate',
    danceType: 'kizomba',
    duration: 1.5,
    maxParticipants: 20,
    description: 'Explore deeper connection and styling in kizomba'
  },
  {
    id: '12',
    name: 'Cha Cha Basics',
    danceType: 'chacha',
    duration: 1,
    maxParticipants: 35,
    description: 'Learn the triple step and timing of cha cha'
  },
  {
    id: '13',
    name: 'Cha Cha Intermediate',
    danceType: 'chacha',
    duration: 1,
    maxParticipants: 25,
    description: 'Master more complex cha cha patterns and styling'
  },
];

export function TemplateLibraryList({ onSelectTemplate, selectedTemplate }: TemplateLibraryListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="space-y-2 mb-4">
        <DialogTitle className="text-lg">Template Library</DialogTitle>
        <p className="text-muted-foreground text-sm">
          Choose a template to get started quickly
        </p>
      </div>

      {/* Scrollable Templates */}
      <div className="space-y-3 pr-2 -mr-2 overflow-y-auto flex-1">
        {mockTemplates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          return (
            <Card
              key={template.id}
              className={`cursor-pointer hover:shadow-md transition-shadow border-2 ${isSelected
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary'
                }`}
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="space-y-1 text-xs">
                  <div>Dance: {template.danceType}</div>
                  <div>Duration: {template.duration} {template.duration === 1 ? 'hour' : 'hours'}</div>
                  <div>Max: {template.maxParticipants} people</div>
                  {template.description && (
                    <div className="mt-2 text-xs text-muted-foreground/80">{template.description}</div>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
