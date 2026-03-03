import { Card, Label, User, ChecklistItem } from './types';

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
  checklist: Array<{
    text: string;
    done: boolean;
  }>;
}

/**
 * Validates if a JSON object represents a valid card
 */
export function validateCardJSON(data: any): data is CardJSON {
  if (!data || typeof data !== 'object') return false;
  
  // Required fields
  if (typeof data.title !== 'string' || data.title.trim() === '') return false;
  
  // Optional fields validation
  if (data.description && typeof data.description !== 'string') return false;
  
  // Validate labels array
  if (data.labels && !Array.isArray(data.labels)) return false;
  if (data.labels && !data.labels.every((label: any) => 
    typeof label === 'object' && 
    typeof label.text === 'string' && 
    typeof label.color === 'string'
  )) return false;
  
  // Validate members array
  if (data.members && !Array.isArray(data.members)) return false;
  if (data.members && !data.members.every((member: any) => 
    typeof member === 'object' && 
    typeof member.name === 'string' && 
    (member.email === undefined || typeof member.email === 'string')
  )) return false;
  
  // Validate dates
  if (data.startDate && !isValidISOString(data.startDate)) return false;
  if (data.dueDate && !isValidISOString(data.dueDate)) return false;
  
  // Validate checklist
  if (data.checklist && !Array.isArray(data.checklist)) return false;
  if (data.checklist && !data.checklist.every((item: any) => 
    typeof item === 'object' && 
    typeof item.text === 'string' && 
    typeof item.done === 'boolean'
  )) return false;
  
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
    checklist: card.checklist.map(item => ({
      text: item.text,
      done: item.done
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
        boardLabel.text === jsonLabel.text && 
        boardLabel.color === jsonLabel.color
      );
      return matchingLabel?.id;
    })
    .filter((id): id is string => id !== undefined);

  // Map member objects to member IDs
  const members = cardJSON.members
    .map(jsonMember => {
      const matchingMember = boardMembers.find(boardMember => 
        boardMember.name === jsonMember.name && 
        (jsonMember.email ? boardMember.email === jsonMember.email : true)
      );
      return matchingMember?.id;
    })
    .filter((id): id is string => id !== undefined);

  // Convert checklist items
  const checklist: ChecklistItem[] = cardJSON.checklist.map((item, index) => ({
    id: `checklist-${index}`, // Temporary ID, will be replaced by store
    text: item.text,
    done: item.done
  }));

  return {
    title: cardJSON.title,
    description: cardJSON.description,
    labelIds,
    members,
    startDate: cardJSON.startDate ? new Date(cardJSON.startDate) : undefined,
    dueDate: cardJSON.dueDate ? new Date(cardJSON.dueDate) : undefined,
    checklist,
    completed: false
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
