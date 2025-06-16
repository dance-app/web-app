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
import {
  useMarketplaceMaterials,
  useMaterialCopy,
} from '@/hooks/use-marketplace-materials';
import { Material } from '@/types/material';
import { Search, Star, Clock, Eye, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketplaceMaterialsProps {
  onView?: (material: Material) => void;
}

export function MarketplaceMaterials({ onView }: MarketplaceMaterialsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<
    number | undefined
  >();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { materials, isLoading, hasMore } = useMarketplaceMaterials({
    search: searchTerm || undefined,
    difficulty: difficultyFilter,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    limit: 20,
  });

  const { mutate: copyMaterial, isPending: isCopying } = useMaterialCopy();

  const handleCopyMaterial = (material: Material) => {
    copyMaterial(material.id.toString(), {
      onSuccess: () => {
        toast.success(`"${material.name}" copied to your workspace`);
      },
      onError: () => {
        toast.error('Failed to copy material');
      },
    });
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
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search marketplace materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={difficultyFilter?.toString() || 'all'}
          onValueChange={(value) =>
            setDifficultyFilter(value === 'all' ? undefined : parseInt(value))
          }
        >
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

      <div className="text-sm text-gray-600 mb-4">
        Found {materials.length} materials in marketplace
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No materials found</div>
          <div className="text-gray-400 text-sm">
            Try adjusting your search or filters
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {materials.map((material: any) => (
            <Card
              key={material.id}
              className="hover:shadow-md transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2 truncate">
                      {material.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Public
                      </Badge>
                      {material.metadata?.difficulty && (
                        <div className="flex items-center gap-1">
                          {getDifficultyStars(material.metadata.difficulty)}
                        </div>
                      )}
                      {material.metadata?.estimatedLearningTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {material.metadata.estimatedLearningTime}min
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(material)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyMaterial(material)}
                      disabled={isCopying}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="line-clamp-2 mb-3">
                  {material.description}
                </CardDescription>
                {material.metadata?.tags &&
                  material.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {material.metadata.tags.slice(0, 4).map((tag: any, index: any) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {material.metadata.tags.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{material.metadata.tags.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                <div className="mt-3 text-xs text-gray-500">
                  Added {new Date(material.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              /* Load more logic */
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
