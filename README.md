# Flowboard v1.1.0

A modern, feature-rich project management application inspired by Trello, built with React, Next.js, and TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## Features

### Core Functionality
- **Four Switchable Views**: Kanban (default), Timeline (Gantt-style), Calendar, and Table views
- **Drag-and-Drop**: Full drag-and-drop support for cards between lists using @dnd-kit
- **Rich Card Management**: Detailed card editing with descriptions, labels, members, dates, and checklists
- **Real-time Search**: Filter cards by title, description, labels, and members
- **Dark/Light Theme**: System preference detection with manual toggle
- **Responsive Design**: Mobile-optimized with collapsible sidebar and touch-friendly interactions
- **Board Management**: Create, switch between, and delete boards with confirmation dialogs
- **Board Export/Import**: Save and load board data as JSON files for backup and sharing

### Data Model
- **Boards**: Multiple boards with member management
- **Lists**: Organized columns within boards
- **Cards**: Rich cards with metadata (labels, members, dates, checklists)
- **Persistence**: Local storage with easy migration path to cloud services

### Timeline Enhancements 🚀
- **Advanced Zoom Levels**: Day, Week, 2 Weeks, Month, and Year views with keyboard shortcuts (1-5)
- **Hidden Cards Indicators**: Visual indicators for cards outside the current date range
- **Interactive Tooltips**: Hover over hidden cards to see detailed information
- **Collapsible Swimlanes**: Expand/collapse parent swimlanes for better organization
- **Smart Card Positioning**: Automatic vertical stacking to prevent overlaps
- **Performance Optimized**: Efficient rendering for large datasets

## Tech Stack / Built With 🛠️

![React](https://img.shields.io/badge/React-19.2.3-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript for full type safety
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: Zustand for lightweight state management
- **Drag & Drop**: @dnd-kit for advanced interactions
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://gitlab.com/user4302_Projects/coding/next-js/flowboard.git
cd flowboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
flowboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx           # Main application page
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── board/             # Board-specific components
│   │   ├── card/              # Card components
│   │   └── views/             # View implementations
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and types
│   ├── store/                 # Zustand state management
│   └── styles/                # Global styles
├── public/                    # Static assets
├── VERSION                    # Version file
└── README.md
```

## Usage / Quick Start ⚡

### Basic Navigation
1. **Sidebar**: Navigate between boards and create new ones
2. **Header**: Switch views, search cards, manage theme and members, export/import boards
3. **Main Area**: Interact with the current view (Kanban, Timeline, Calendar, or Table)

### Timeline View Features
- **Keyboard Shortcuts**: Press 1-5 to quickly switch between zoom levels
- **Hidden Cards**: Small colored squares indicate cards outside the current date range
- **Interactive Tooltips**: Hover over hidden cards to see details without clicking
- **Collapsible Swimlanes**: Click the arrow to expand/collapse parent swimlanes
- **Smart Navigation**: Use the header controls to navigate dates and zoom levels

### Kanban View
- Drag cards between lists to reorganize
- Click "Add a card" to create new cards
- Click "Add another list" to create new lists
- Click on cards to open detailed editing modal

### Board Management
- **Export Boards**: Click the download icon in the header to save board data as JSON
- **Import Boards**: Click the upload icon to load board data from a JSON file
- **Inline Title Editing**: Click the board title to edit it directly
### Card Editing
- **Title & Description**: Inline editing with validation
- **Labels**: Color-coded labels for categorization
- **Members**: Assign team members to cards
- **Dates**: Set start and due dates
- **Checklist**: Add progress tracking items

### Other Views
- **Calendar**: Monthly grid view showing due dates
- **Table**: Sortable data table with all card properties

## Data Persistence

The application uses localStorage for client-side persistence. Data is automatically saved when:
- Creating, updating, or deleting boards, lists, or cards
- Changing UI preferences (theme, sidebar state, current view)

## Future Enhancements

### Planned Features
- **Real-time Collaboration**: WebSocket connections for multi-user editing
- **File Attachments**: Upload and manage files on cards
- **Comments**: Discussion threads on cards
- **Advanced Filtering**: More sophisticated search and filter options
- **Keyboard Shortcuts**: Power user productivity features
- **Export/Import**: Backup and restore functionality

### Migration to Cloud
The application is designed for easy migration to cloud services:
- **Netlify Functions**: Serverless API endpoints
- **PostgreSQL**: Database integration (Neon recommended)
- **Authentication**: User management system
- **Real-time Sync**: Cross-device synchronization

## Deployment

### Netlify (Recommended)

#### Method 1: Drag & Drop
1. Run `npm run build` to create the production build
2. Drag the `out` folder to the Netlify deploy area
3. Your site will be live instantly

#### Method 2: Git Integration
1. Push your code to a Git repository
2. Connect the repository to Netlify
3. Deploy automatically on push to main branch

#### Method 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=out
```

### Configuration Files
The project includes:
- `netlify.toml` - Build configuration and redirects
- `netlify/functions/` - Example serverless functions for future API integration
- `VERSION` - Current version file for tracking

### Other Platforms
The application can be deployed to any platform supporting static sites:
- **Vercel**: Connect repository and deploy automatically
- **AWS Amplify**: Static site hosting with CI/CD
- **Firebase Hosting**: Deploy via Firebase CLI
- **GitHub Pages**: Use GitHub Actions for deployment

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support & Contact 👋

For any questions, bug reports, feature requests, or security concerns, please open an issue on GitLab: https://gitlab.com/user4302_Projects/coding/next-js/flowboard/-/issues

No email or direct messaging support is available.
