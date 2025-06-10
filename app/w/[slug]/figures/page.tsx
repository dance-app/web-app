"use client"

import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FiguresList } from '@/components/figures/figures-list'
import { MarketplaceFigures } from '@/components/figures/marketplace-figures'
import { FigureCreateModal } from '@/components/figures/figure-create-modal'
import { FigureDetailsModal } from '@/components/figures/figure-details-modal'
import { useFigures } from '@/hooks/use-figures'
import { useFigureDelete } from '@/hooks/use-figure-delete'
import { useCurrentWorkspace } from '@/hooks/use-current-workspace'
import { Figure } from '@/types'
import { toast } from 'sonner'
import { PageLayout } from '@/components/page-layout'

export default function FiguresPage() {
  const { workspace } = useCurrentWorkspace()
  const { figures, isLoading } = useFigures()
  const { mutate: deleteFigure } = useFigureDelete()

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null)
  const [editingFigure, setEditingFigure] = useState<Figure | null>(null)

  const handleViewFigure = (figure: Figure) => {
    setSelectedFigure(figure)
    setDetailsModalOpen(true)
  }

  const handleEditFigure = (figure: Figure) => {
    setEditingFigure(figure)
    setDetailsModalOpen(false)
    // TODO: Open edit modal
  }

  const handleDeleteFigure = (figureId: string) => {
    if (confirm('Are you sure you want to delete this figure?')) {
      deleteFigure(figureId, {
        onSuccess: () => {
          toast.success('Figure deleted successfully')
          setDetailsModalOpen(false)
        },
        onError: () => {
          toast.error('Failed to delete figure')
        },
      })
    }
  }

  const breadcrumbItems = [
    { label: workspace?.name || 'Workspace', href: `/w/${workspace?.slug}` },
    { label: 'Figures', href: `/w/${workspace?.slug}/figures` },
  ]

  return (
    <PageLayout header={<>
      <Breadcrumbs items={breadcrumbItems} />
      <Button onClick={() => setCreateModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Figure
      </Button>
    </>}>

      <Tabs defaultValue="workspace" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workspace" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Figures ({figures.length})
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Workspace Figures</h2>
              <p className="text-gray-600 text-sm">
                Figures created in or copied to this workspace
              </p>
            </div>
          </div>

          <FiguresList
            figures={figures}
            isLoading={isLoading}
            onView={handleViewFigure}
            onEdit={handleEditFigure}
            onDelete={handleDeleteFigure}
            canEdit={true}
          />
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Figure Marketplace</h2>
            <p className="text-gray-600 text-sm">
              Discover and copy figures shared by the community
            </p>
          </div>

          <MarketplaceFigures onView={handleViewFigure} />
        </TabsContent>
      </Tabs>

      <FigureCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <FigureDetailsModal
        figure={selectedFigure}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onEdit={handleEditFigure}
        onDelete={handleDeleteFigure}
        canEdit={selectedFigure?.workspaceId === workspace?.id}
      />
    </PageLayout>
  )
}
