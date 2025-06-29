'use client';

import { useState } from 'react';
import { Plus, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { MaterialsList } from '@/components/materials/materials-list';
import { MarketplaceMaterials } from '@/components/materials/marketplace-materials';
import { MaterialCreateModal } from '@/components/materials/material-create-modal';
import { MaterialDetailsModal } from '@/components/materials/material-details-modal';
import { useMaterials } from '@/hooks/use-materials';
import { useMaterialDelete } from '@/hooks/use-material-delete';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { toast } from 'sonner';
import { PageLayout } from '@/components/page-layout';
import { Material } from '@/types/material';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MaterialsPage() {
  const { workspace } = useCurrentWorkspace();
  const { materials, isLoading } = useMaterials();
  const { mutate: deleteMaterial } = useMaterialDelete();

  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setDetailsModalOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setDetailsModalOpen(false);
    // TODO: Open edit modal
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(materialId, {
        onSuccess: () => {
          toast.success('Material deleted successfully');
          setDetailsModalOpen(false);
        },
        onError: () => {
          toast.error('Failed to delete material');
        },
      });
    }
  };
  console.log(materials)
  return (
    <PageLayout
      header={
        <>
          <Breadcrumbs
            title={
              <div className='flex items-center gap-2'>
                <BookOpen size={16} />
                Materials
              </div>
            }
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setCreateModalOpen(true)} variant='ghost' className='h-8 w-8'>
                    <Plus className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create new material</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      }
    >
      <Tabs defaultValue="workspace" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workspace" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Materials ({materials.length})
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6">
          <MaterialsList
            materials={materials}
            isLoading={isLoading}
            onView={handleViewMaterial}
            onEdit={handleEditMaterial}
            onDelete={handleDeleteMaterial}
            canEdit={true}
          />
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Material Marketplace</h2>
            <p className="text-gray-600 text-sm">
              Discover and copy materials shared by the community
            </p>
          </div>

          <MarketplaceMaterials onView={handleViewMaterial} />
        </TabsContent>
      </Tabs>

      <MaterialCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <MaterialDetailsModal
        material={selectedMaterial}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onEdit={handleEditMaterial}
        onDelete={handleDeleteMaterial}
        canEdit={selectedMaterial?.workspaceId === workspace?.id}
      />
    </PageLayout>
  );
}
