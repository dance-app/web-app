'use client';

import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function MaterialsPage() {
  const { workspace } = useCurrentWorkspace();
  const { materials, isLoading } = useMaterials();
  const { mutate: deleteMaterial } = useMaterialDelete();

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
          <Breadcrumbs items={[{ label: 'Materials' }]} />
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Material
          </Button>
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
