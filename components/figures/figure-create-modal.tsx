"use client"

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useFigureCreate } from '@/hooks/use-figure-create'
import { FigureVisibility } from '@/types'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required'),
  visibility: z.nativeEnum(FigureVisibility),
  difficulty: z.number().min(1).max(5).optional(),
  tags: z.string().optional(),
  videoUrls: z.string().optional(),
  photoUrls: z.string().optional(),
  estimatedLearningTime: z.number().min(1).optional(),
})

type FormData = z.infer<typeof formSchema>

interface FigureCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FigureCreateModal({ open, onOpenChange }: FigureCreateModalProps) {
  const { mutate: createFigure, isPending } = useFigureCreate()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: FigureVisibility.PRIVATE,
      difficulty: 1,
      tags: '',
      videoUrls: '',
      photoUrls: '',
      estimatedLearningTime: 15,
    },
  })

  const onSubmit = (data: FormData) => {
    const metadata = {
      difficulty: data.difficulty,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      videoUrls: data.videoUrls ? data.videoUrls.split(',').map(url => url.trim()).filter(Boolean) : [],
      photoUrls: data.photoUrls ? data.photoUrls.split(',').map(url => url.trim()).filter(Boolean) : [],
      estimatedLearningTime: data.estimatedLearningTime,
    }

    createFigure({
      name: data.name,
      description: data.description,
      visibility: data.visibility,
      metadata,
    }, {
      onSuccess: () => {
        toast.success('Figure created successfully')
        form.reset()
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to create figure')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Figure</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Figure name" {...field} />
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
                    <Textarea
                      placeholder="Describe the figure, including technique and steps..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={FigureVisibility.PRIVATE}>Private</SelectItem>
                        <SelectItem value={FigureVisibility.WORKSPACE_SHARED}>Workspace Shared</SelectItem>
                        <SelectItem value={FigureVisibility.PUBLIC}>Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty (1-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="salsa, basic, turn, intermediate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedLearningTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Learning Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 15)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URLs (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="https://example.com/video1.mp4, https://example.com/video2.mp4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URLs (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  'Create Figure'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}