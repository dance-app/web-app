'use client';

import { useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Member } from '@/types';

export function useSelectedMember(members: Member[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get selected member from URL params
  const memberId = searchParams.get('memberId');

  const selectedMember = useMemo(() => {
    if (!memberId || !members.length) return null;
    return members.find((member) => member.id === memberId) || null;
  }, [memberId, members]);

  // Function to update URL state for selected member
  const setSelectedMember = useCallback(
    (member: Member | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (member) {
        current.set('memberId', member.id);
      } else {
        current.delete('memberId');
      }

      const search = current.toString();
      const query = search ? `?${search}` : '';

      router.push(`${window.location.pathname}${query}`);
    },
    [searchParams, router]
  );

  // Clean up invalid member ID from URL if member doesn't exist
  useEffect(() => {
    if (memberId && members.length > 0 && !selectedMember) {
      // Member ID exists in URL but member not found, remove it
      setSelectedMember(null);
    }
  }, [memberId, members.length, selectedMember, setSelectedMember]);

  return {
    selectedMember,
    setSelectedMember,
    memberId,
  };
}
