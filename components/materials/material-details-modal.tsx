'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Material, MaterialVisibility } from '@/types/material';
import {
  Clock,
  Star,
  Tag,
  Video,
  Image as ImageIcon,
  Edit,
  Trash2,
} from 'lucide-react';

interface MaterialDetailsModalProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (material: Material) => void;
  onDelete?: (materialId: string) => void;
  canEdit?: boolean;
}

export function MaterialDetailsModal({
  material,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  canEdit = false,
}: MaterialDetailsModalProps) {
  if (!material) return null;

  const getVisibilityColor = (visibility: MaterialVisibility) => {
    switch (visibility) {
      case MaterialVisibility.PUBLIC:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case MaterialVisibility.WORKSPACE:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case MaterialVisibility.PRIVATE:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getDifficultyStars = (difficulty?: number) => {
    if (!difficulty) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                {material.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getVisibilityColor(material.visibility)}>
                  {material.visibility.replace('_', ' ').toLowerCase()}
                </Badge>
                {/* {material.metadata?.difficulty && (
                  <div className="flex items-center gap-1">
                    {getDifficultyStars(material.metadata.difficulty)}
                  </div>
                )} */}
              </div>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(material)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(material.id.toString())}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {material.description}
              </p>
            </div>

            {material && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* {material.metadata.estimatedLearningTime && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Learning Time</p>
                        <p className="text-sm text-gray-600">
                          {material.metadata.estimatedLearningTime} minutes
                        </p>
                      </div>
                    </div>
                  )} */}

                  {/* {material.metadata.tags &&
                    material.metadata.tags.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium mb-2">Tags</p>
                          <div className="flex flex-wrap gap-1">
                            {material.metadata.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )} */}
                </div>

                {/* {(material.metadata.videoUrls?.length ||
                  material.metadata.photoUrls?.length) && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        {material.metadata.videoUrls &&
                          material.metadata.videoUrls.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Video className="h-5 w-5 text-gray-500" />
                                <h3 className="font-semibold">Videos</h3>
                              </div>
                              <div className="space-y-2">
                                {material.metadata.videoUrls.map((url, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(url, '_blank')}
                                      className="justify-start"
                                    >
                                      <Video className="h-4 w-4 mr-2" />
                                      Video {index + 1}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {material.metadata.photoUrls &&
                          material.metadata.photoUrls.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <ImageIcon className="h-5 w-5 text-gray-500" />
                                <h3 className="font-semibold">Photos</h3>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {material.metadata.photoUrls.map((url, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(url, '_blank')}
                                    className="justify-start"
                                  >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Photo {index + 1}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </>
                  )} */}
              </>
            )}

            <Separator />
            <div className="text-sm text-gray-500">
              <p>
                Created: {new Date(material.createdAt).toLocaleDateString()}
              </p>
              <p>
                Updated: {new Date(material.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
