# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Board sharing and collaboration system with invitation-based access
- Invite modal for creating shareable invitation links with configurable expiration
- Join board modal for users to access shared boards via invitation links
- Member management interface for board owners to approve/reject join requests
- Peer-to-peer (P2P) connection system for real-time board synchronization
- Netlify API route configuration for invitation handling
- Sharing controls in sidebar for board owners
- Comprehensive sharing store with Zustand for state management
- URL parameter support for direct board invitation access
- Keyboard shortcuts (1-5) for quick timeline zoom level switching
- 2 weeks zoom level replacing quarter view for better practicality
- Quarter markers (Q1-Q4) in timeline year view for better orientation
- Enhanced timeline UI styling with improved button contrast and active states
- Enhanced month view with daily granularity and improved date labeling
- Fixed card stacking logic for out-of-range cards in timeline view
- Added hidden cards indicator and expandable list for out-of-range timeline cards
- Fixed day view card overlapping issue with proper vertical stacking
- Created HiddenCardsIndicator component with dual-side directional indicators
- Added useDateRange and useHiddenCards hooks for better component separation
- Enhanced hidden cards with directional indicators (before/after) and performance optimizations
- Added comprehensive JSDoc comments and documentation to all components and utilities
- Improved MemberManagement component code organization and readability
- Enhanced timeline hidden cards with interactive tooltips and consistent logic
- Optimized timeline hidden cards calculation performance for large datasets
- Created usePositioning hook with full card positioning logic
- Created TimelineCard component for individual card rendering
- Created TimelineHeader component with zoom controls and navigation
- Created TimelineGrid component for date headers and grid lines
- TimelineView reduced from ~750 lines to 548 lines (27% reduction)
- All functionality preserved with cleaner component separation
- Export and Import board data functionality
- Styled tooltips for mini cards with enhanced visual design
- Visual squares for hidden cards indicator
- Collapsible parent swimlanes with expand/collapse functionality
- Keyboard shortcuts for timeline navigation (dedicated hook)
- IndividualCardSwimlane component for better card organization
- SubCardSwimlane component for nested card management
- Timeline utilities for enhanced positioning and layout calculations
- MiniCardTooltip dedicated component for improved UX
- Reduced welcome screen display time from 2 seconds to 500ms for faster app loading
- Fixed tooltip z-index issues by increasing to z-[9999] for proper layering
- Added comprehensive timeline state management with per-board persistence
- Enhanced timeline positioning with debug logging for troubleshooting
- Improved TypeScript type safety in UI store functions
- Major UI restructuring: migrated sidebar management buttons to header hamburger menu
- Renamed BoardHeader component to Header with enhanced sharing functionality
- Added robust timeline date validation and error handling with automatic recovery
- Removed IndividualCardSwimlane component to simplify timeline architecture
- Enhanced TimelineHeader with invalid date detection and navigation safety
- Optimized currentBoard lookup in useBoard hook for better performance
- Enhanced timeline date handling with comprehensive debugging and validation
- Fixed critical date serialization issue causing card misalignment after import and refresh
- Added robust Date object handling in localStorage persistence with automatic cleanup
- Enhanced timeline positioning with comprehensive date validation and string-to-Date conversion
- Improved hidden cards logic with proper date validation and error handling
- Fixed timeline data disappearing after date navigation with zoom level validation
- Added comprehensive debugging and fallback mechanisms for timeline state management
- Fixed UTC date conversion in board store storage middleware for proper persistence
- Optimized hidden cards calculation in timeline view to avoid duplicate processing
- Refactored timeline component naming for better clarity and consistency
- Renamed timeline hooks and utils for cleaner architecture
- Refactored timeline components from card to task terminology
- Consolidated getTaskPosition function for simpler structure
- Implemented modular architecture for timeline task positioning
- Renamed component interfaces for consistency
- Improved date handling and removed debug logging
- Enhanced type safety and consistency in timeline components
- Simplified TaskLane component interface and fixed task overflow bug
- Corrected date indexing in month view timeline

### Changed
- Improved board header responsive layout with fixed 3-column structure
- Added truncation to prevent board title overflow on small screens
- Made search bar responsive and visible on all screen sizes
- Enhanced view tab centering and layout stability
- Fixed timeline view scrolling to contain within its container
- Enhanced TimelineView with multi-level zoom functionality (Day, Week, Month, Quarter, Year)
- Improved timeline navigation with zoom-aware date controls
- Added year selector with custom input for year view
- Enhanced timeline date labeling and visual indicators
- Simplified timeline view by removing redundant year selector controls
- Fixed timeline card positioning for cards outside visible date range
- Added clickable timeline cards to open card details modal
- Implemented card stacking system for overlapping timeline cards
- Added dynamic timeline height calculation based on card stack levels
- Simplified timeline card positioning logic with direct calculations
- Enhanced day view with improved edge collection for out-of-range cards
- Improved date formatting for different timeline zoom levels
- Enhanced timeline navigation logic for new zoom levels
- Fixed label ID generation in CardModal for proper data integrity
- Improved type safety and form handling in CardModal
- Updated timeline zoom controls with keyboard shortcut hints
- Enhanced visual feedback for active zoom levels
- Made date inputs side by side in CardModal for better layout
- Enhanced timeline layout with main swimlanes and sub-card swimlanes
- Improved swimlane visual distinction for parent swimlanes
- Major refactoring: TimelineView reduced from 422 to 123 lines (71% reduction)
- Enhanced hidden cards placement in empty swimlanes
- Improved timeline header alignment with right-side space
- Equal width distribution for left and right side spaces
- Always show swimlanes even when empty in current range
- Removed horizontal borders from side spaces for cleaner look

### Fixed
- CardModal label creation with proper ID generation
- TypeScript type casting issues in select elements
- Form state management robustness in card editing
- Stop automatic board creation on page refresh
- Remove mock data and enable proper date editing for cards
- Correct hidden cards placement in empty swimlanes
- Timeline layout and card positioning issues
- Hardcoded mock data for Homepage redesign card
- Card positioning and date calculation issues

### Refactoring
- Extracted MiniCardTooltip to dedicated component
- Major refactor: Main swimlanes with sub-card swimlanes architecture
- TimelineView component breakdown into smaller, focused components
- Improved code organization with dedicated hooks and utilities
- Enhanced component separation for better maintainability

## [1.1.0] - 2026-02-25

### 🎯 **Major UI Restructuring: Sidebar to Hamburger Menu Migration**

#### ✅ **New Features**
- **Centralized Action Menu**: Moved all management buttons from sidebar to header hamburger menu
- **Cleaner Sidebar**: Now focused purely on board navigation and management
- **Enhanced Hamburger Menu**: Added 4 new buttons with proper hover effects and styling

#### 🔄 **Changes Made**

**BoardHeader Component:**
- **Added Sharing Store Integration**: Imported `useSharingStore` for modal management
- **Added Modal Components**: Moved `InviteModal` and `MemberManagement` to header
- **Enhanced Hamburger Menu**: 
  - Invite Members (Share2 icon) - Owner only
  - Member Management (UserPlus icon) - Owner only  
  - Team Members (Users icon) - Placeholder
  - Settings (Settings icon) - Placeholder
- **Improved Styling**: Added hover effects, proper spacing, and visual divider
- **Conditional Rendering**: Owner-only buttons properly gated by `isOwner` state

**Sidebar Component:**
- **Removed Quick Actions Section**: Eliminated entire management button section
- **Removed Sharing Dependencies**: No longer imports or uses sharing store
- **Cleaned Up Imports**: Removed unused icon imports
- **Focused Functionality**: Now purely board-centric navigation

#### 🎨 **UI/UX Improvements**
- **Better Organization**: All management functions centralized in header
- **Cleaner Interface**: Sidebar reduced to essential board navigation
- **Consistent Styling**: Hover effects match existing design patterns
- **Mobile Friendly**: Easier access to all functions from header hamburger menu

#### 🐛 **Technical Details**
- **State Management**: Proper sharing store integration in header component
- **Modal Handling**: Invite and member management modals moved to header
- **Icon Consistency**: All buttons use appropriate Lucide icons
- **Responsive Design**: Maintained mobile-first approach

## [1.0.0] - 2026-02-24

### 🎯 **Initial Release**

#### ✅ **Core Features**
- **Board Management**: Create, edit, delete boards
- **Multiple Views**: Kanban, Calendar, Timeline, Table views
- **Dark/Light Theme**: System-wide theme switching
- **Import/Export**: JSON board data import/export functionality
- **Responsive Design**: Mobile and desktop optimized interface

#### 🎨 **UI Components**
- **Sidebar Navigation**: Board list with quick actions
- **Header Controls**: Search, view switching, member management
- **Interactive Cards**: Drag-and-drop functionality
- **Modal System**: Invite members and manage permissions with labels, members, dates, and checklists
- Real-time search and filtering capabilities
- Dark/light theme support with system preference detection
- Responsive design for mobile, tablet, and desktop
- Local storage data persistence
- Comprehensive TypeScript type definitions
- Glassmorphic design elements
- Accessibility features (ARIA labels, keyboard navigation)
- Seed data with realistic "Website Redesign" project
- Netlify deployment configuration
- Example serverless functions for future API integration

### Changed
- Replaced default Next.js template with custom Flowboard application
- Updated project structure for maintainability
- Implemented Zustand for state management
- Added React Hook Form with Zod validation

### Technical
- Next.js 14 with App Router
- TypeScript for full type safety
- Tailwind CSS with custom design system
- Component-based architecture
- Modular hook system
- Service-oriented state management
