'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBoardStore } from '@/store';
import { List, Board } from '@/lib/types';
import { Z_INDEX, CSS_CLASSES } from '../constants';
import { LabelManagerPosition } from '../types';

interface MovePortalProps {
  show: boolean;
  position: LabelManagerPosition;
  cardId: string;
  currentListId: string;
  onClose: () => void;
}

interface BoardListsPopupProps {
  board: Board;
  position: LabelManagerPosition;
  cardId: string;
  currentListId: string;
  onSelectList: (boardId: string, listId: string) => void;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Individual board lists popup component
 */
function BoardListsPopup({ board, position, cardId, currentListId, onSelectList, onClose, onMouseEnter, onMouseLeave }: BoardListsPopupProps) {
  const handleSelectList = useCallback((listId: string) => {
    onSelectList(board.id, listId);
    onClose();
  }, [board.id, onSelectList, onClose]);

  return (
    <div
      className={`fixed bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 py-2 min-w-[200px] max-w-xs overflow-y-auto`}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        zIndex: Z_INDEX.MODAL,
        maxHeight: 'calc(100vh - 16px)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {board.name}
      </div>
      {board.lists.map((list) => (
        <button
          key={list.id}
          onClick={() => handleSelectList(list.id)}
          disabled={list.id === currentListId}
          className={`${CSS_CLASSES.MENU_ITEM} ${CSS_CLASSES.MENU_ITEM_DEFAULT} ${list.id === currentListId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <span>{list.title}</span>
          {list.id === currentListId && (
            <span className="text-xs text-slate-500 ml-auto">Current</span>
          )}
        </button>
      ))}
    </div>
  );
}

/**
 * Move portal component - Shows lists for moving cards
 */
export function MovePortal({ show, position, cardId, currentListId, onClose }: MovePortalProps) {
  const { getCurrentBoard, boards, moveCard, moveCardBetweenBoards } = useBoardStore();
  const [hoveredBoardId, setHoveredBoardId] = useState<string | null>(null);
  const [hoveredBoardRect, setHoveredBoardRect] = useState<DOMRect | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentBoard = getCurrentBoard();
  const otherBoards = boards.filter(board => board.id !== currentBoard?.id);

  const handleSelectList = useCallback((targetBoardId: string, targetListId: string) => {
    if (targetBoardId && targetListId) {
      // Check if moving to the same board or different board
      if (targetBoardId === currentBoard?.id) {
        // Same board move
        moveCard(targetBoardId, cardId, currentListId, targetListId, 0);
      } else {
        // Different board move
        moveCardBetweenBoards(currentBoard!.id, targetBoardId, cardId, currentListId, targetListId, 0);
      }
    }
  }, [moveCard, moveCardBetweenBoards, cardId, currentListId, currentBoard]);

  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleBoardMouseEnter = useCallback((boardId: string, event: React.MouseEvent) => {
    clearHoverTimeout();
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setHoveredBoardId(boardId);
    setHoveredBoardRect(rect);
  }, [clearHoverTimeout]);

  const handleBoardMouseLeave = useCallback(() => {
    clearHoverTimeout();
    timeoutRef.current = setTimeout(() => {
      setHoveredBoardId(null);
      setHoveredBoardRect(null);
    }, 100); // Small delay to allow moving to nested popup
  }, [clearHoverTimeout]);

  const handleNestedMouseEnter = useCallback(() => {
    clearHoverTimeout();
  }, [clearHoverTimeout]);

  const handleNestedMouseLeave = useCallback(() => {
    clearHoverTimeout();
    timeoutRef.current = setTimeout(() => {
      setHoveredBoardId(null);
      setHoveredBoardRect(null);
    }, 100);
  }, [clearHoverTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, [clearHoverTimeout]);

  if (!show || !currentBoard) return null;

  // Calculate position for nested popup
  const nestedPopupPosition = hoveredBoardRect ? {
    left: hoveredBoardRect.right + 4, // 4px gap
    top: hoveredBoardRect.top,
  } : {
    left: position.left + 220,
    top: position.top,
  };

  return (
    <>
      {createPortal(
        <div
          className={`fixed bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 py-2 min-w-[200px] max-w-xs overflow-y-auto`}
          style={{
            left: `${position.left}px`,
            top: `${position.top}px`,
            zIndex: Z_INDEX.MODAL,
            maxHeight: 'calc(100vh - 16px)',
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Current Board Lists */}
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Current Board
          </div>
          {currentBoard.lists.map((list) => (
            <button
              key={list.id}
              onClick={() => handleSelectList(currentBoard.id, list.id)}
              disabled={list.id === currentListId}
              className={`${CSS_CLASSES.MENU_ITEM} ${CSS_CLASSES.MENU_ITEM_DEFAULT} ${list.id === currentListId ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <span>{list.title}</span>
              {list.id === currentListId && (
                <span className="text-xs text-slate-500 ml-auto">Current</span>
              )}
            </button>
          ))}

          {/* Separator */}
          {otherBoards.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-600 my-1" />
          )}

          {/* Other Boards */}
          {otherBoards.map((board) => (
            <div
              key={board.id}
              className="relative"
              onMouseEnter={(e) => handleBoardMouseEnter(board.id, e)}
              onMouseLeave={handleBoardMouseLeave}
            >
              <button
                className={`${CSS_CLASSES.MENU_ITEM} ${CSS_CLASSES.MENU_ITEM_DEFAULT}`}
                style={{ cursor: 'default' }}
              >
                <span>{board.name}</span>
                <span className="text-xs text-slate-500 ml-auto">→</span>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* Nested popup for hovered board's lists */}
      {hoveredBoardId && createPortal(
        <BoardListsPopup
          board={otherBoards.find(board => board.id === hoveredBoardId)!}
          position={nestedPopupPosition}
          cardId={cardId}
          currentListId={currentListId}
          onSelectList={handleSelectList}
          onClose={() => setHoveredBoardId(null)}
          onMouseEnter={handleNestedMouseEnter}
          onMouseLeave={handleNestedMouseLeave}
        />,
        document.body
      )}
    </>
  );
}
