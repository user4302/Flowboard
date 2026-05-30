# Flowboard Import Format Template

This document specifies the required JSON format for importing boards into Flowboard. This schema maps directly to the application's internal data structures.

## File Structure

```json
{
  "id": "board-unique-id",
  "name": "Board Name",
  "createdAt": "2026-05-30T10:00:00Z",
  "updatedAt": "2026-05-30T12:00:00Z",
  "labels": [
    {
      "id": "label-unique-id",
      "text": "Label Text",
      "color": "#ef4444"
    }
  ],
  "members": [
    {
      "id": "user-unique-id",
      "name": "User Name",
      "avatarUrl": "https://example.com/avatar.png",
      "email": "user@example.com"
    }
  ],
  "lists": [
    {
      "id": "list-unique-id",
      "title": "List Title",
      "position": 0,
      "color": "#ffffff",
      "cards": [
        {
          "id": "card-unique-id",
          "listId": "list-unique-id",
          "title": "Card Title",
          "description": "Optional description",
          "labelIds": ["label-unique-id"],
          "members": ["user-unique-id"],
          "checklists": [
            {
              "id": "checklist-unique-id",
              "name": "Checklist Name",
              "position": 0,
              "createdAt": "2026-05-30T10:00:00Z",
              "updatedAt": "2026-05-30T10:00:00Z",
              "items": [
                {
                  "id": "item-unique-id",
                  "text": "Checklist item text",
                  "done": false
                }
              ]
            }
          ],
          "startDate": "2026-05-30T09:00:00Z",
          "dueDate": "2026-06-01T17:00:00Z",
          "completed": false,
          "position": 0,
          "priority": 1,
          "createdAt": "2026-05-30T10:00:00Z",
          "updatedAt": "2026-05-30T10:00:00Z"
        }
      ]
    }
  ],
  "archivedCards": [
    {
      "id": "archived-card-unique-id",
      "originalListId": "list-unique-id",
      "originalPosition": 0,
      "archivedAt": "2026-05-30T15:00:00Z",
      "card": {
        "id": "card-unique-id",
        "listId": "list-unique-id",
        "title": "Archived Card",
        "labelIds": [],
        "members": [],
        "checklists": [],
        "completed": false,
        "position": 0,
        "createdAt": "2026-05-30T10:00:00Z",
        "updatedAt": "2026-05-30T10:00:00Z"
      }
    }
  ]
}
```

## Schema Definitions

### Board (Top Level)
- `id` (string, required): Unique identifier
- `name` (string, required): Board name
- `createdAt` (string, required): ISO 8601 timestamp
- `updatedAt` (string, required): ISO 8601 timestamp
- `labels` (array, required): Array of Label objects
- `members` (array, required): Array of User objects
- `lists` (array, required): Array of List objects
- `archivedCards` (array, required): Array of ArchivedCard objects

### Label Object
- `id` (string, required): Unique identifier
- `text` (string, required): Label text
- `color` (string, required): Hex color code (e.g., "#ef4444")

### User Object
- `id` (string, required): Unique identifier
- `name` (string, required): User name
- `avatarUrl` (string, optional): URL to avatar image
- `email` (string, optional): User email

### List Object
- `id` (string, required): Unique identifier
- `title` (string, required): List title
- `position` (number, required): 0-based index
- `color` (string, optional): Hex color code
- `cards` (array, required): Array of Card objects

### Card Object
- `id` (string, required): Unique identifier
- `listId` (string, required): ID of the parent list
- `title` (string, required): Card title
- `description` (string, optional): Card description
- `labelIds` (array, required): Array of label IDs
- `members` (array, required): Array of member IDs (references User.id)
- `checklists` (array, required): Array of Checklist objects
- `startDate` (string, optional): ISO 8601 timestamp
- `dueDate` (string, optional): ISO 8601 timestamp
- `completed` (boolean, required): Completion status
- `position` (number, required): 0-based index within the list
- `priority` (number, optional): Priority level
- `createdAt` (string, required): ISO 8601 timestamp
- `updatedAt` (string, required): ISO 8601 timestamp

### Checklist Object
- `id` (string, required): Unique identifier
- `name` (string, required): Checklist name
- `position` (number, required): 0-based index
- `createdAt` (string, required): ISO 8601 timestamp
- `updatedAt` (string, required): ISO 8601 timestamp
- `items` (array, required): Array of ChecklistItem objects

### ChecklistItem Object
- `id` (string, required): Unique identifier
- `text` (string, required): Item text
- `done` (boolean, required): Completion status

### ArchivedCard Object
- `id` (string, required): Unique identifier
- `originalListId` (string, required): ID of the list the card belonged to
- `originalPosition` (number, required): 0-based index
- `archivedAt` (string, required): ISO 8601 timestamp
- `card` (object, required): The Card object before archiving

## Implementation Notes

1. **Date Format**: All timestamps must be valid ISO 8601 strings (e.g., `2026-05-30T10:00:00Z`).
2. **References**:
   - `Card.labelIds` must match `Label.id`.
   - `Card.members` must match `User.id`.
   - `Card.listId` must match `List.id`.
   - `ArchivedCard.originalListId` refers to the original `List.id`.
3. **Uniqueness**: All `id` fields must be unique within the JSON object to ensure correct data mapping.
