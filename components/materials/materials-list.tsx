'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Material, MaterialVisibility } from '@/types/material';
import { Search, Star, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MaterialsListProps {
  materials: Material[];
  isLoading?: boolean;
  onView?: (material: Material) => void;
  onEdit?: (material: Material) => void;
  onDelete?: (materialId: string) => void;
  canEdit?: boolean;
}

export function MaterialsList({
  materials,
  isLoading,
  onView,
  onEdit,
  onDelete,
  canEdit = false,
}: MaterialsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase())
    // ||
    // material.metadata?.tags?.some((tag) =>
    //   tag.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const matchesVisibility =
      visibilityFilter === 'all' || material.visibility === visibilityFilter;

    const matchesDifficulty =
      difficultyFilter === 'all'
    //  ||
    // material.metadata?.difficulty?.toString() === difficultyFilter;

    return matchesSearch && matchesVisibility && matchesDifficulty;
  });

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
        className={`h-3 w-3 ${i < difficulty ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Visibility</SelectItem>
            <SelectItem value={MaterialVisibility.PUBLIC}>Public</SelectItem>
            <SelectItem value={MaterialVisibility.WORKSPACE}>
              Workspace
            </SelectItem>
            <SelectItem value={MaterialVisibility.PRIVATE}>Private</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No materials found</div>
          <div className="text-gray-400 text-sm">
            {searchTerm ||
              visibilityFilter !== 'all' ||
              difficultyFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first material to get started'}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              className="hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2 truncate">
                      {material.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={`${getVisibilityColor(
                          material.visibility
                        )} text-xs`}
                      >
                        {material.visibility.replace('_', ' ').toLowerCase()}
                      </Badge>
                      {/* {material.metadata?.difficulty && (
                        <div className="flex items-center gap-1">
                          {getDifficultyStars(material.metadata.difficulty)}
                        </div>
                      )} */}
                      {/* {material.metadata?.estimatedLearningTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {material.metadata.estimatedLearningTime}min
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(material);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canEdit && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(material);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(material.id.toString());
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0" onClick={() => onView?.(material)}>
                <CardDescription className="line-clamp-2 mb-3">
                  {material.description}
                </CardDescription>
                {/* {material.metadata?.tags &&
                  material.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {material.metadata.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {material.metadata.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{material.metadata.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )} */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
