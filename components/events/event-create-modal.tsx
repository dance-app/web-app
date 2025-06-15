'use client';

import { useState } from 'react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useEventCreate } from '@/hooks/use-event-create';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { Loader2 } from 'lucide-react';

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

type EventFormData = z.infer<typeof eventSchema>;

interface EventCreateModalProps {
  children: React.ReactNode;
}

export function EventCreateModal({ children }: EventCreateModalProps) {
  const [open, setOpen] = useState(false);
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

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Beginner Salsa Class" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a description for your class..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="danceTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dance Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dance type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {danceTypes.length === 0 ? (
                        <SelectItem value="no-types" disabled>
                          No dance types configured
                        </SelectItem>
                      ) : (
                        danceTypes.map((danceType) => (
                          <SelectItem key={danceType.id} value={danceType.id}>
                            {danceType.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Duration: {field.value} hour{field.value !== 1 ? 's' : ''}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0.5}
                      max={4}
                      step={0.5}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>30 min</span>
                    <span>4 hours</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Maximum Participants: {field.value} people
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={5}
                      max={50}
                      step={5}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 people</span>
                    <span>50 people</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createEvent.isPending}>
                {createEvent.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Schedule Class
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
