'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEventCreate } from '@/hooks/use-event-create';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { TemplateLibraryList, ClassTemplate } from './template-library-list';
import { CreateEventForm, EventFormData } from './event-create-form';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  danceTypeId: z.string().min(1, 'Dance type is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z
    .number()
    .min(0.5, 'Duration must be at least 30 minutes')
    .max(8, 'Duration cannot exceed 8 hours'),
  maxParticipants: z
    .number()
    .min(1, 'Must allow at least 1 participant')
    .max(100, 'Cannot exceed 100 participants'),
});

interface EventCreateModalProps {
  children: React.ReactNode;
}

export function EventCreateModal({ children }: EventCreateModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ClassTemplate | null>(null);
  const createEvent = useEventCreate();
  const { workspace } = useCurrentWorkspace();

  const danceTypes = workspace?.configuration?.danceTypes || [];

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      danceTypeId: '',
      date: '',
      startTime: '19:00', // Default to 7 PM
      duration: 1.5, // Default to 1.5 hours
      maxParticipants: 20,
    },
  });

  // Function to find dance type ID by name
  const findDanceTypeId = (danceTypeName: string): string => {
    const danceType = danceTypes.find(dt =>
      dt.name.toLowerCase() === danceTypeName.toLowerCase()
    );
    return danceType?.id || '';
  };

  // Prefill form when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const currentValues = form.getValues();
      form.reset({
        title: selectedTemplate.name,
        description: selectedTemplate.description || '',
        danceTypeId: findDanceTypeId(selectedTemplate.danceType),
        date: currentValues.date || '', // Keep existing date if set
        startTime: currentValues.startTime || '19:00', // Keep existing time if set
        duration: selectedTemplate.duration,
        maxParticipants: selectedTemplate.maxParticipants,
      });
    }
  }, [selectedTemplate, danceTypes, form]);

  const onSubmit = async (data: EventFormData) => {
    try {
      // Combine date and time to create start datetime
      const startDateTime = new Date(`${data.date}T${data.startTime}`);

      // Calculate end time by adding duration in hours
      const endDateTime = new Date(
        startDateTime.getTime() + data.duration * 60 * 60 * 1000
      );

      await createEvent.mutateAsync({
        title: data.title,
        description: data.description,
        danceTypeId: data.danceTypeId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        maxParticipants: data.maxParticipants,
      });

      handleModalClose();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleModalClose = () => {
    form.reset();
    setSelectedTemplate(null);
    setOpen(false);
  };

  const handleTemplateSelect = (template: ClassTemplate) => {
    setSelectedTemplate(template);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        handleModalClose();
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[80vw] max-w-none max-h-none p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Schedule a class</DialogTitle>
        </DialogHeader>

        <div className="flex h-[80vh]">
          <div className="w-[30%] border-r bg-muted/20 p-6 flex flex-col">
            <TemplateLibraryList
              onSelectTemplate={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          </div>

          {/* Create Form - Right Side */}
          <div className="flex-1 p-6 overflow-y-auto">
            <CreateEventForm
              form={form}
              danceTypes={danceTypes}
              selectedTemplate={selectedTemplate}
              isLoading={createEvent.isPending}
              onBack={handleModalClose}
              onSubmit={onSubmit}
              onCancel={handleModalClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
