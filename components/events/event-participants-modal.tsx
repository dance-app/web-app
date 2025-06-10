"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Users, UserCheck, UserX, ExternalLink, Mail } from "lucide-react"
import type { Event, Participation } from "@/types"
import { useCurrentWorkspace } from "@/hooks/use-current-workspace"
import { useRouter } from "next/navigation"
import { DanceRoleTag } from "@/components/ui/dance-role-tag"
import { ParticipationTag } from "@/components/ui/participation-tag"

interface EventParticipantsModalProps {
  children: React.ReactNode
  event: Event
}

export function EventParticipantsModal({ children, event }: EventParticipantsModalProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { workspace } = useCurrentWorkspace()
  const router = useRouter()

  const participations = event.participations || []
  const registeredCount = participations.filter(p => p.status === 'registered').length
  const presentCount = participations.filter(p => p.status === 'present').length
  const absentCount = participations.filter(p => p.status === 'absent').length

  const updateParticipationStatus = (participationId: string, status: 'registered' | 'present' | 'absent' | 'invited') => {
    // TODO: Implement with API call
    console.log('Update participation:', participationId, status)
  }

  const filteredParticipations = participations.filter(participation =>
    participation.member?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Manage Participants - {event.title}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(`/w/${workspace?.slug}/classes/${event.id}/manage`)
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Screen
            </Button>
          </div>
        </DialogHeader>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{participations.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-xs text-muted-foreground">Present</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{registeredCount}</div>
              <div className="text-xs text-muted-foreground">Registered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <div className="text-xs text-muted-foreground">Absent</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Participants List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredParticipations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No participants found' : 'No participants yet'}
            </div>
          ) : (
            filteredParticipations.map((participation) => (
              <div key={participation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {participation.member?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{participation.member?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      <DanceRoleTag role={participation.member?.preferedDanceRole} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ParticipationTag status={participation.status} size="sm" />

                  <Select
                    value={participation.status}
                    onValueChange={(value: 'registered' | 'present' | 'absent' | 'invited') =>
                      updateParticipationStatus(participation.id, value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invited">Invited</SelectItem>
                      <SelectItem value="registered">Registered</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
