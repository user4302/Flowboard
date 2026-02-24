import { useEffect } from 'react';
import { useBoardStore } from '@/store';
import { useSharingStore } from '@/store/sharingStore';
import { generateId } from '@/lib/utils';
import { Board, List, Card, User, Label } from '@/lib/types';

const seedData = {
  board: {
    name: 'Website Redesign',
    members: [
      { id: '1', name: 'Alex Johnson', avatarUrl: '', email: 'alex@example.com' },
      { id: '2', name: 'Sarah Chen', avatarUrl: '', email: 'sarah@example.com' },
      { id: '3', name: 'Mike Wilson', avatarUrl: '', email: 'mike@example.com' },
    ] as User[],
  },
  lists: [
    {
      title: 'Backlog',
      cards: [
        {
          title: 'Design system audit',
          description: 'Review and document existing design tokens and components',
          labels: [{ text: 'Design', color: 'bg-purple-500' }],
          members: ['1'],
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          checklist: [
            { text: 'Audit color palette', done: false },
            { text: 'Review typography scale', done: false },
            { text: 'Document spacing system', done: false },
          ],
        },
        {
          title: 'User research synthesis',
          description: 'Analyze user interview data and create insights report',
          labels: [{ text: 'Research', color: 'bg-blue-500' }],
          members: ['2'],
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          checklist: [
            { text: 'Transcribe interviews', done: true },
            { text: 'Identify patterns', done: false },
            { text: 'Create affinity map', done: false },
          ],
        },
      ],
    },
    {
      title: 'In Progress',
      cards: [
        {
          title: 'Homepage redesign',
          description: 'Create new homepage layout with improved conversion focus',
          labels: [
            { text: 'Design', color: 'bg-purple-500' },
            { text: 'High Priority', color: 'bg-red-500' },
          ],
          members: ['1', '3'],
          startDate: new Date('2026-02-22T20:45:34.773Z'), // Feb 22, 2026 at 8:45 PM
          dueDate: new Date('2026-02-27T20:45:34.773Z'), // Feb 27, 2026 at 8:45 PM
          checklist: [
            { text: 'Create wireframes', done: true },
            { text: 'Design high-fidelity mockups', done: true },
            { text: 'Build responsive prototype', done: false },
            { text: 'Test conversion rates', done: false },
            { text: 'Deploy to staging', done: false },
          ],
        },
        {
          title: 'Performance optimization',
          description: 'Improve page load times and Core Web Vitals',
          labels: [{ text: 'Development', color: 'bg-green-500' }],
          members: ['3'],
          startDate: new Date('2026-02-22T20:45:34.773Z'), // Feb 22, 2026 at 8:45 PM
          dueDate: new Date('2026-02-27T20:45:34.773Z'), // Feb 27, 2026 at 8:45 PM
          checklist: [
            { text: 'Audit current performance', done: true },
            { text: 'Optimize images', done: false },
            { text: 'Implement lazy loading', done: false },
            { text: 'Minify CSS/JS', done: false },
          ],
        },
      ],
    },
    {
      title: 'Review',
      cards: [
        {
          title: 'Mobile navigation prototype',
          description: 'Test new mobile navigation patterns with users',
          labels: [{ text: 'UX', color: 'bg-orange-500' }],
          members: ['2'],
          startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Due tomorrow
          checklist: [
            { text: 'Create interactive prototype', done: true },
            { text: 'Schedule user tests', done: true },
            { text: 'Conduct testing sessions', done: false },
            { text: 'Document findings', done: false },
          ],
        },
        {
          title: 'Color accessibility review',
          description: 'Ensure all color combinations meet WCAG AA standards',
          labels: [{ text: 'Accessibility', color: 'bg-teal-500' }],
          members: ['1'],
          startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          checklist: [
            { text: 'Test contrast ratios', done: true },
            { text: 'Update color palette', done: false },
            { text: 'Update design system', done: false },
          ],
        },
      ],
    },
    {
      title: 'Done',
      cards: [
        {
          title: 'Stakeholder interviews',
          description: 'Conduct interviews with key stakeholders to gather requirements',
          labels: [{ text: 'Research', color: 'bg-blue-500' }],
          members: ['2'],
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          checklist: [
            { text: 'Prepare interview questions', done: true },
            { text: 'Schedule interviews', done: true },
            { text: 'Conduct interviews', done: true },
            { text: 'Summarize findings', done: true },
          ],
        },
        {
          title: 'Competitive analysis',
          description: 'Analyze competitor websites and identify opportunities',
          labels: [{ text: 'Strategy', color: 'bg-indigo-500' }],
          members: ['1', '2'],
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          checklist: [
            { text: 'Identify key competitors', done: true },
            { text: 'Analyze features', done: true },
            { text: 'Create comparison matrix', done: true },
            { text: 'Present findings', done: true },
          ],
        },
        {
          title: 'Technical requirements document',
          description: 'Document technical specifications and constraints',
          labels: [{ text: 'Development', color: 'bg-green-500' }],
          members: ['3'],
          startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          checklist: [
            { text: 'Define technical stack', done: true },
            { text: 'Document API requirements', done: true },
            { text: 'Specify performance targets', done: true },
            { text: 'Review with team', done: true },
          ],
        },
      ],
    },
  ] as Array<{
    title: string;
    cards: Array<{
      title: string;
      description?: string;
      labels: Label[];
      members: string[];
      startDate?: Date;
      dueDate?: Date;
      checklist: Array<{ text: string; done: boolean }>;
    }>;
  }>,
};

export function useBoard() {
  const {
    boards,
    currentBoardId,
    getCurrentBoard,
    createBoard,
    createList,
    createCard,
    setCurrentBoard,
  } = useBoardStore();

  const { setUserInfo } = useSharingStore();

  useEffect(() => {
    // Set up sharing info for current user (owner)
    if (boards.length > 0 && currentBoardId) {
      const currentBoard = getCurrentBoard();
      if (currentBoard) {
        // Set current user as board owner
        setUserInfo(
          'owner-123', // Owner ID
          'Board Owner', // Username
          'owner@flowboard.app', // Email
          true // Is owner
        );
      }
    }
  }, [boards.length, currentBoardId, getCurrentBoard, setUserInfo]);

  const currentBoard = getCurrentBoard();

  return {
    boards,
    currentBoard,
    currentBoardId,
    setCurrentBoard,
    createBoard,
    createList,
    createCard,
  };
}
