# Flowboard v1.5.0

A modern, feature-rich project management application inspired by Trello, built with React, Next.js, and TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.8.2-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## Features 

### Core Functionality
- **Four Switchable Views**: Kanban (default), Timeline (Gantt-style), Calendar, and Table views
- **Drag-and-Drop**: Full drag-and-drop support for cards between lists and list reordering using @dnd-kit
- **Rich Card Management**: Detailed card editing with descriptions, labels, members, dates, checklists, and priority
- **Context Menu Actions**: Right-click context menu for quick card operations (duplicate, archive, copy link, edit labels)
- **Direct Card Links**: Share direct links to specific cards via URL parameters for quick access
- **Card Archiving**: Archive completed cards with restore and permanent delete options
- **Real-time Search**: Filter cards by title, description, labels, and members
- **Dark/Light Theme**: System preference detection with manual toggle
- **Responsive Design**: Mobile-optimized with collapsible sidebar and touch-friendly interactions
- **Board Management**: Create, switch between, and delete boards with confirmation dialogs
- **Board Export/Import**: Save and load board data as JSON files for backup and sharing
- **Card JSON Import/Export**: Copy, download, and upload individual cards as JSON with smart paste functionality
- **Board Sharing & Collaboration**: Invitation-based board sharing with member management and real-time synchronization

### Data Model
- **Boards**: Multiple boards with member management
- **Lists**: Organized columns within boards
- **Cards**: Rich cards with metadata (labels, members, dates, checklists, priority)
- **Persistence**: Local storage with easy migration path to cloud services

### Timeline Enhancements 🚀
- **Advanced Zoom Levels**: Day, Week, 2 Weeks, Month, and Year views with keyboard shortcuts (1-5)
- **Hidden Cards Indicators**: Visual indicators for cards outside the current date range
- **Interactive Tooltips**: Hover over hidden cards to see detailed information
- **Collapsible Swimlanes**: Expand/collapse parent swimlanes for better organization
- **Smart Card Positioning**: Automatic vertical stacking to prevent overlaps
- **Performance Optimized**: Efficient rendering for large datasets

### Kanban Enhancements 📋
- **List Reordering**: Drag list headers to reorder columns with persistent positioning
- **Enhanced Drag Handles**: Visual feedback and improved drag-and-drop performance
- **Optimistic Updates**: Immediate UI feedback during drag operations

### Calendar Enhancements 📅
- **Overflow Modal**: Click "+N more" to view all tasks when day cells contain more than 3 tasks
- **Interactive Task List**: Full task modal access from overflow modal with proper navigation flow
- **Visual Color Indicators**: Colored bars on left edge of task items for quick label identification
- **Enhanced Design**: Improved spacing, hover effects, and modern card-based layout
- **Mobile-Inspired Design**: Modal-based navigation similar to mobile calendar applications

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

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

## Installation 📥

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

## Usage / Quick Start ⚡

### Creating Your First Board
1. Open the application and click "Create New Board"
2. Enter a board name (e.g., "Website Redesign")
3. Start adding lists and cards to organize your project

### Kanban View Features
- **Drag cards between lists** to update their status
- **Drag list headers** to reorder columns
- **Click "Add a list"** to create new columns
- **Double-click cards** to edit details
- **Use the search bar** to filter cards instantly
- **Smart paste**: When valid card JSON is in clipboard, a paste button appears for quick card creation
- **Dedicated card creation buttons**: Separate buttons for adding cards, uploading JSON files, and pasting from clipboard

### Card JSON Import/Export
- **Copy JSON**: Right-click card → "Copy JSON" to copy card data to clipboard
- **Download JSON**: Right-click card → "Download JSON" to save as file
- **Upload JSON**: Right-click → "Upload JSON" or use smart paste button
- **Clone Card**: Right-click card → "Clone" to create duplicate with same properties

### Keyboard Shortcuts
- `1-5`: Switch timeline zoom levels (Day, Week, 2 Weeks, Month, Year)
- `Escape`: Close modals and dropdowns

## Project Structure 📂

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
│   ├── lib/                   # Utility functions
│   └── store/                 # State management
├── public/                    # Static assets
├── docs/                      # Additional documentation
└── netlify/                   # Netlify functions
```

## Configuration 🔧

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
# Add your environment variables here
```

### Theme Configuration
The application automatically detects system theme preference. Users can manually toggle between light and dark themes using the header control.

## Development / Running Locally 🏗️

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality
- **ESLint**: Configured with Next.js recommended rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (recommended)

### Component Development
- Use TypeScript interfaces for all props
- Follow the existing component structure
- Add JSDoc comments for public functions
- Test with both light and dark themes

## Testing 🧪

Currently, the project uses manual testing. To run the application and test features:

```bash
npm run dev
```

Test the following workflows:
- Board creation and management
- Card creation, editing, and deletion
- Drag-and-drop functionality
- View switching (Kanban, Timeline, Calendar, Table)
- Search and filtering
- Theme switching
- Import/export functionality

## Building for Production 🏭

```bash
npm run build
npm run start
```

The production build is optimized for:
- Minimal bundle size
- Fast loading times
- Efficient rendering
- SEO optimization

## Deployment 🚀

### Netlify Deployment
The project includes Netlify configuration for easy deployment:

1. Connect your GitLab repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
3. Deploy automatically on pushes to main branch

### Manual Deployment
```bash
npm run build
# Deploy the 'out' directory to your hosting provider
```

## Contributing 🤝

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Merge Request on GitLab

### Code Style
- Use conventional commit messages
- Follow existing code patterns
- Add TypeScript types for new code
- Include JSDoc comments for public APIs

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Contact 👋

For questions, bugs, features, or security issues, please open an issue on GitLab:
[https://gitlab.com/user4302_Projects/coding/next-js/flowboard/-/issues](https://gitlab.com/user4302_Projects/coding/next-js/flowboard/-/issues)

No email or direct support is provided. All support requests should be submitted through GitLab Issues.

## Acknowledgments 🙏

- Inspired by Trello's kanban board functionality
- Built with modern web technologies and best practices
- Thanks to all contributors who help improve this project
