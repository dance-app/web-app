import type { Member } from '@/types';
import { delay } from './shared.api';

export const students = {
  async getAll(): Promise<Member[]> {
    await delay(500);

    // Mock data - not currently used in the app
    return [];
  },

  // Mock methods - not currently used in the app
  async create(): Promise<Member> {
    await delay(300);
    throw new Error('Not implemented');
  },

  async update(): Promise<Member> {
    await delay(300);
    throw new Error('Not implemented');
  },

  async delete(): Promise<void> {
    await delay(300);
    throw new Error('Not implemented');
  },
};

// export const api = {
//   auth,
//   workspace,
//   students,
// };
