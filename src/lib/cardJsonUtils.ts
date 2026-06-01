import { Card, Label, User, ChecklistItem } from './types';
import { generateId } from './utils';

/**
 * Interface for clean card JSON format
 * Excludes system fields like id, position, timestamps
 */
export interface CardJSON {
  title: string;
  description?: string;
  labels: Array<{
    text: string;
    color: string;
  }>;
  members: Array<{
    name: string;
    email?: string;
  }>;
  startDate?: string; // ISO string
  dueDate?: string; // ISO string
  priority?: number;
  checklists?: Array<{
    name: string;
    items: Array<{
      text: string;
      done: boolean;
    }>;
  }>;
  checklist?: Array<{ // Kept for backward compatibility
    text: string;
    done: boolean;
  }>;
}

/**
 * Validates if a JSON object represents a valid card
 */
export function validateCardJSON(data: unknown): data is CardJSON {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  // Required fields
  if (typeof obj.title !== 'string' || obj.title.trim() === '') return false;

  // Optional fields validation
  if (obj.description && typeof obj.description !== 'string') return false;

  // Validate labels array
  if (obj.labels && (!Array.isArray(obj.labels) || !obj.labels.every((label: unknown) =>
    typeof label === 'object' && label !== null &&
    typeof (label as { text: unknown }).text === 'string' &&
    typeof (label as { color: unknown }).color === 'string'
  ))) return false;

  // Validate members array
  if (obj.members && (!Array.isArray(obj.members) || !obj.members.every((member: unknown) =>
    typeof member === 'object' && member !== null &&
    typeof (member as { name: unknown }).name === 'string' &&
    ((member as { email?: unknown }).email === undefined || typeof (member as { email: string }).email === 'string')
  ))) return false;

  // Validate dates
  if (obj.startDate && (typeof obj.startDate !== 'string' || !isValidISOString(obj.startDate))) return false;
  if (obj.dueDate && (typeof obj.dueDate !== 'string' || !isValidISOString(obj.dueDate))) return false;

  // Validate checklist
  if (obj.checklist && (!Array.isArray(obj.checklist) || !obj.checklist.every((item: unknown) =>
    typeof item === 'object' && item !== null &&
    typeof (item as { text: unknown }).text === 'string' &&
    typeof (item as { done: unknown }).done === 'boolean'
  ))) return false;

  return true;
}

/**
 * Checks if a string is a valid ISO date string
 */
function isValidISOString(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes('T');
}

/**
 * Converts a Card to clean CardJSON format
 */
export function cardToJSON(card: Card, boardLabels: Label[], boardMembers: User[]): CardJSON {
  // Map label IDs to label objects
  const labels = card.labelIds
    .map(id => boardLabels.find(label => label.id === id))
    .filter((label): label is Label => label !== undefined)
    .map(label => ({
      text: label.text,
      color: label.color
    }));

  // Map member IDs to member objects
  const members = card.members
    .map(id => boardMembers.find(member => member.id === id))
    .filter((member): member is User => member !== undefined)
    .map(member => ({
      name: member.name,
      email: member.email
    }));

  return {
    title: card.title,
    description: card.description,
    labels,
    members,
    startDate: card.startDate?.toISOString(),
    dueDate: card.dueDate?.toISOString(),
    checklists: (card.checklists || []).map(c => ({
      name: c.name,
      items: c.items.map(item => ({
        text: item.text,
        done: item.done
      }))
    }))
  };
}

/**
 * Converts CardJSON to Card data for creation
 * Maps labels and members to board IDs
 */
export function jsonToCardData(
  cardJSON: CardJSON,
  boardLabels: Label[],
  boardMembers: User[]
): Omit<Card, 'id' | 'position' | 'createdAt' | 'updatedAt' | 'listId'> {
  // Map label objects to label IDs
  const labelIds = cardJSON.labels
    .map(jsonLabel => {
      const matchingLabel = boardLabels.find(boardLabel =>
        boardLabel.text.toLowerCase() === jsonLabel.text.toLowerCase() &&
        boardLabel.color === jsonLabel.color
      );
      return matchingLabel?.id;
    })
    .filter((id): id is string => id !== undefined);

  // Map member objects to member IDs
  const members = cardJSON.members
    .map(jsonMember => {
      const matchingMember = boardMembers.find(boardMember =>
        boardMember.name.toLowerCase() === jsonMember.name.toLowerCase() &&
        (jsonMember.email ? boardMember.email?.toLowerCase() === jsonMember.email.toLowerCase() : true)
      );
      return matchingMember?.id;
    })
    .filter((id): id is string => id !== undefined);

  // Convert checklist items
  let checklists: import('./types').Checklist[] = [];
  if (cardJSON.checklists) {
    checklists = cardJSON.checklists.map((c, index) => ({
      id: generateId(),
      name: c.name,
      items: c.items.map((item, itemIndex) => ({
        id: generateId(),
        text: item.text,
        done: item.done
      })),
      position: index,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  } else if (cardJSON.checklist) {
    // Backward compatibility
    checklists = [{
      id: generateId(),
      name: 'Checklist',
      items: cardJSON.checklist.map((item, index) => ({
        id: generateId(),
        text: item.text,
        done: item.done
      })),
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }];
  }

  return {
    title: cardJSON.title,
    description: cardJSON.description,
    labelIds,
    members,
    startDate: cardJSON.startDate ? new Date(cardJSON.startDate) : undefined,
    dueDate: cardJSON.dueDate ? new Date(cardJSON.dueDate) : undefined,
    checklists,
    completed: false,
    priority: cardJSON.priority !== undefined ? cardJSON.priority : null
  };
}

/**
 * Downloads card JSON as a file
 */
export function downloadCardJSON(cardJSON: CardJSON, filename: string): void {
  const jsonString = JSON.stringify(cardJSON, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reads and parses a JSON file
 */
export async function readCardJSONFile(file: File): Promise<CardJSON> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!validateCardJSON(data)) {
    throw new Error('Invalid card JSON format');
  }

  return data;
}
