import type { Student } from '@/types';
import { delay } from './shared.api';

export const students = {
  async getAll(): Promise<Student[]> {
    await delay(500);

    return [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
        role: 'leader',
        level: 'advanced',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
        role: 'follower',
        level: 'intermediate',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
      {
        id: '3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
        role: 'both',
        level: 'beginner',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'david@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
        role: 'leader',
        level: 'intermediate',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      },
      {
        id: '5',
        name: 'Eva Brown',
        email: 'eva@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
        role: 'follower',
        level: 'advanced',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19'),
      },
    ];
  },

  async create(
    student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Student> {
    await delay(300);
    return {
      ...student,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async update(id: string, student: Partial<Student>): Promise<Student> {
    await delay(300);
    return {
      id,
      name: student.name || '',
      email: student.email || '',
      avatar: student.avatar,
      role: student.role || 'follower',
      level: student.level || 'beginner',
      createdAt: student.createdAt || new Date(),
      updatedAt: new Date(),
    };
  },

  async delete(id: string): Promise<void> {
    await delay(300);
  },
};

// export const api = {
//   auth,
//   workspace,
//   students,
// };
