'use client';

import { useState } from 'react';
import { Search, Menu, Sun, Moon, Users, Plus } from 'lucide-react';
import { useBoardStore, useUIStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { VIEWS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function BoardHeader() {
  const { boards, currentBoardId, updateBoard } = useBoardStore();
  const {
    currentView,
    sidebarOpen,
    theme,
    setCurrentView,
    setSidebarOpen,
    setTheme,
    searchTerm,
    setSearchTerm,
  } = useUIStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  const currentBoard = boards.find(board => board.id === currentBoardId);

  const handleTitleEdit = () => {
    if (currentBoard) {
      setTempTitle(currentBoard.name);
      setIsEditingTitle(true);
    }
  };

  const handleTitleSave = () => {
    if (currentBoard && tempTitle.trim() && tempTitle !== currentBoard.name) {
      useBoardStore.getState().updateBoard(currentBoard.id, { name: tempTitle.trim() });
    }
    setIsEditingTitle(false);
    setTempTitle('');
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTempTitle('');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!currentBoard) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Board title */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyPress}
                className="rounded-lg border border-slate-300 px-2 py-1 text-lg font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                autoFocus
              />
            ) : (
              <h1
                className="cursor-pointer text-lg font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
                onClick={handleTitleEdit}
              >
                {currentBoard.name}
              </h1>
            )}
          </div>
        </div>

        {/* Center - View tabs */}
        <div className="hidden md:flex items-center gap-1">
          {VIEWS.map((view) => {
            const Icon = require('lucide-react')[view.icon];
            return (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id as any)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  currentView === view.id
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{view.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10"
            />
          </div>

          {/* Members */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {currentBoard.members.slice(0, 3).map((member: any, index: number) => (
                <div
                  key={member.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-medium text-white dark:border-slate-900"
                  style={{ zIndex: 3 - index }}
                >
                  {member.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
              ))}
              {currentBoard.members.length > 3 && (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-medium text-slate-600 dark:border-slate-900 dark:bg-slate-600 dark:text-slate-300"
                  style={{ zIndex: 0 }}
                >
                  +{currentBoard.members.length - 3}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="ml-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile view tabs */}
      <div className="flex overflow-x-auto border-t border-slate-200 px-2 py-2 dark:border-slate-700 md:hidden">
        {VIEWS.map((view) => {
          const Icon = require('lucide-react')[view.icon];
          return (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id as any)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap',
                currentView === view.id
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{view.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
