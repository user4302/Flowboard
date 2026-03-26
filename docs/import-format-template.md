# Flowboard Import Format Template

This document specifies the required JSON format for importing boards into Flowboard. Use this template when creating board data manually or generating it from external sources.

## File Structure

```json
{
  "name": "Board Name",
  "exportDate": "2026-03-27T01:14:00Z",
  "labels": [
    {
      "id": "unique-label-id",
      "text": "Label Text",
      "color": "bg-color-class"
    }
  ],
  "lists": [
    {
      "title": "List Title",
      "cards": [
        {
          "id": "unique-card-id",
          "title": "Card Title",
          "description": "Optional description",
          "labelIds": ["label-id-1", "label-id-2"],
          "members": [],
          "checklists": [
            {
              "id": "unique-checklist-id",
              "name": "Checklist Name",
              "items": [
                {
                  "id": "unique-item-id",
                  "text": "Checklist item text",
                  "done": false
                }
              ],
              "position": 0,
              "createdAt": "2026-03-27T01:14:00Z",
              "updatedAt": "2026-03-27T01:14:00Z"
            }
          ],
          "startDate": "2026-03-27T00:00:00.000Z",
          "dueDate": "2026-03-27T00:00:00.000Z",
          "completed": false,
          "position": 0,
          "listId": "parent-list-id",
          "priority": null,
          "createdAt": "2026-03-27T01:14:00Z",
          "updatedAt": "2026-03-27T01:14:00Z"
        }
      ]
    }
  ]
}
```

## Required Fields

### Top Level
- `name` (string): Board name
- `exportDate` (string): ISO 8601 timestamp
- `labels` (array): Array of label objects (can be empty)
- `lists` (array): Array of list objects

### Label Object
- `id` (string): Unique identifier for the label
- `text` (string): Display text of the label
- `color` (string): Tailwind CSS color class (e.g., "bg-blue-500", "bg-red-500")

### List Object
- `title` (string): List title
- `cards` (array): Array of card objects (can be empty)

### Card Object
- `id` (string): Unique identifier for the card
- `title` (string): Card title
- `listId` (string): ID of the parent list
- `position` (number): Position within the list (0-based)

### Checklist Object (Optional)
- `id` (string): Unique identifier for the checklist
- `name` (string): Checklist name
- `items` (array): Array of checklist items
- `position` (number): Position (usually 0)
- `createdAt` (string): ISO 8601 timestamp
- `updatedAt` (string): ISO 8601 timestamp

### Checklist Item Object
- `id` (string): Unique identifier for the item
- `text` (string): Item text
- `done` (boolean): Completion status

## Optional Fields

### Card Object
- `description` (string): Card description
- `labelIds` (array): Array of label IDs referencing the labels array
- `members` (array): Array of member IDs
- `checklists` (array): Array of checklist objects
- `startDate` (string): ISO 8601 date string
- `dueDate` (string): ISO 8601 date string
- `completed` (boolean): Completion status
- `priority` (number | null): Priority level
- `createdAt` (string): ISO 8601 timestamp
- `updatedAt` (string): ISO 8601 timestamp

## Important Notes

1. **Label References**: Cards should use `labelIds` array to reference labels defined in the top-level `labels` array. Do NOT include a `labels` property in cards as this will cause duplication.

2. **Unique IDs**: All IDs should be unique within their scope (labels, cards, checklists, checklist items).

3. **Date Format**: Use ISO 8601 format for all dates and timestamps.

4. **Color Classes**: Use Tailwind CSS background color classes for labels (e.g., "bg-blue-500", "bg-red-500", "bg-green-500").

5. **Position**: Use 0-based indexing for card and list positions.

## Available Label Colors

The application provides 50 colors across 9 color families with 5 shades each:

### Greens
- `bg-green-100`, `bg-green-300`, `bg-green-500`, `bg-green-600`, `bg-green-800`

### Yellows
- `bg-yellow-100`, `bg-yellow-300`, `bg-yellow-500`, `bg-yellow-600`, `bg-yellow-800`

### Oranges
- `bg-orange-100`, `bg-orange-300`, `bg-orange-500`, `bg-orange-600`, `bg-orange-800`

### Reds
- `bg-red-100`, `bg-red-300`, `bg-red-500`, `bg-red-600`, `bg-red-800`

### Purples
- `bg-purple-100`, `bg-purple-300`, `bg-purple-500`, `bg-purple-600`, `bg-purple-800`

### Blues
- `bg-sky-100`, `bg-sky-300`, `bg-sky-500`, `bg-sky-600`, `bg-sky-800`
- `bg-blue-100`, `bg-blue-300`, `bg-blue-500`, `bg-blue-600`, `bg-blue-800`

### Teals
- `bg-teal-100`, `bg-teal-300`, `bg-teal-500`, `bg-teal-600`, `bg-teal-800`

### Pinks
- `bg-pink-100`, `bg-pink-300`, `bg-pink-500`, `bg-pink-600`, `bg-pink-800`

### Slate/Grays
- `bg-slate-100`, `bg-slate-300`, `bg-slate-500`, `bg-slate-600`, `bg-slate-800`

**Note**: The number suffix indicates the shade intensity (100 = lightest, 800 = darkest).

## Example Minimal Board

```json
{
  "name": "Simple Board",
  "exportDate": "2026-03-27T01:14:00Z",
  "labels": [],
  "lists": [
    {
      "title": "To Do",
      "cards": [
        {
          "id": "card-1",
          "title": "Task 1",
          "listId": "list-1",
          "position": 0
        }
      ]
    }
  ]
}
```

## Common Pitfalls to Avoid

1. **❌ Including both `labels` and `labelIds` in cards** - Only use `labelIds`
2. **❌ Non-unique IDs** - Ensure all IDs are unique
3. **❌ Invalid date formats** - Use ISO 8601 format
4. **❌ Missing required fields** - Ensure all required fields are present
5. **❌ Invalid color classes** - Use valid Tailwind CSS background classes

## Testing Your Format

Before importing, validate your JSON file using a JSON validator to ensure proper syntax. The import process will fail if the JSON is malformed or missing required fields.
