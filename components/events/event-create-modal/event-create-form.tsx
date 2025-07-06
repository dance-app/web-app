'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { DialogTitle } from '@/components/ui/dialog';
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
import { DanceType } from '@/types/dance';
import { ClassTemplate } from './template-library-list';

export interface EventFormData {
  title: string;
  description?: string;
  danceTypeId: string;
  date: string;
  startTime: string;
  duration: number;
  maxParticipants: number;
}

interface CreateEventFormProps {
  form: UseFormReturn<EventFormData>;
  danceTypes: DanceType[];
  selectedTemplate: ClassTemplate | null;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export function CreateEventForm({
  form,
  danceTypes,
  selectedTemplate,
  isLoading,
  onBack,
  onSubmit,
  onCancel
}: CreateEventFormProps) {
  return (
    <div className="space-y-6 h-full">
      <div className="space-y-2">
        <DialogTitle className="text-xl">
          {selectedTemplate ? `Using "${selectedTemplate.name}" Template` : 'Create Custom Class'}
        </DialogTitle>
        <p className="text-muted-foreground text-sm">
          Fill in the details for your new class
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

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
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Schedule Class
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
