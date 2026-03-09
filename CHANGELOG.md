# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Added tooltip to paste button for better UX consistency
- Corrected version number from 1.6.0 to 1.3.0
- Improved JSON parsing error handling in clipboard detection to prevent console errors
- Removed emoji from Features heading in README for cleaner formatting
- Add missing description field in createCardFromData to prevent data loss during card creation

### Added
- Card JSON import/export functionality with clipboard detection
- Smart paste functionality for creating cards from clipboard JSON data
- Enhanced context menu with clone, copy JSON, download JSON, and upload JSON options
- Cross-platform clipboard monitoring hook for valid card JSON detection
- Card JSON validation and format conversion utilities
- File upload/download support for card JSON data
- Smart paste button in kanban containers with JSON handling
- CustomTooltip component for reusable tooltip functionality
- Card move functionality with cross-board support and nested popup interface
- MovePortal component for moving cards between lists and boards
- Cross-board card movement with proper positioning and viewport bounds detection
- Dedicated card creation buttons (add, upload, paste) in kanban view

### Changed
- Enhanced board store with createCardFromData method for JSON import support
- Improved UI store with card JSON data and target list ID state management
- Refactored TaskModal components for better form organization and JSON pre-population
- Hardcoded APP_VERSION to avoid package.json import for build stability
- Massive TypeScript cleanup across 58 files with improved type safety
- Removed hardcoded mock data and optimized component architecture
- Enhanced utility functions with better type annotations and import cleanup
- Implemented local-first checklist management in task modal for better performance
- Added batch synchronization for checklist changes to reduce store operations
- Enhanced checklist UI with progress tracking and visual progress bar
- Added real-time completion percentage display with animated progress indicator
- Implemented multiple checklists per card with expandable sections and individual progress tracking
- Refactored board store into modular slice-based architecture for improved maintainability
- Added data migration support from single checklist to multiple checklists format
- Created TaskModalMultiChecklistManager for comprehensive checklist management
- Improved clipboard detection with better focus handling for context menus
- Enhanced paste UX with loading states and always-visible paste button
- Optimized kanban performance with memoized filtered cards
- Auto-close context menu after successful copy/download actions
- Improved context menu positioning with accurate viewport bounds detection
- Added scrolling support for menus that exceed viewport height
- Simplified context menu item labels for cleaner interface
- Consolidated positioning logic in dedicated utils function
- Removed unused cover and upload JSON options from context menu

## [1.3.0] - 2026-03-03

### Added
- Generic useClickOutside hook for click outside detection
- Escape key handling for dropdown menus
- Card context menu with right-click and button trigger options
- Card archiving and unarchiving functionality
- ArchivedCards component for managing archived cards
- Context menu positioning with viewport boundary detection
- Reusable ConfirmationModal component for dangerous actions
- Permanent delete functionality for archived cards with confirmation popup
- Archive button in board header with badge showing archived cards count
- Functional "Edit Labels" context menu option using TaskModalLabelManager
- Label picker integration in card context menu for quick label management
- Comprehensive JSDoc documentation for CardContextMenu component
- Enhanced API documentation with component and hook references
- Updated usage guide with context menu and archived cards workflows
- Functional date picker modal for editing card start and due dates
- Date picker positioning with viewport boundary detection
- Real-time date updates with optimistic UI feedback

### Changed
- Refactored click outside detection to use centralized hook
- Improved dropdown menu handling in BoardHeaderActionMenu
- Enhanced SearchAndFilterDropdown with better ref management
- Updated TaskCard to support context menu integration
- Enhanced board store with archived cards management
- Updated archived cards modal with permanent delete options
- Replaced placeholder label functionality with full label manager integration
- Reorganized types and constants into component-specific files for better maintainability
- Moved component-specific types from global types.ts to respective component folders
- Consolidated constants in component-specific constants files
- Enhanced documentation with comprehensive API reference and usage examples
- Refactored CardContextMenu into modular component architecture with separate utilities, hooks, and types
- Replaced placeholder date functionality with functional date picker modal
- Improved label manager portal structure with proper backdrop and z-index handling
- Enhanced label click interactions in task modal with cursor pointer styling
- Fixed event propagation issues in label manager components

## [1.2.0] - 2026-03-03

### Added
- Kanban list drag-and-drop reordering functionality
- SortableKanbanList component with @dnd-kit/sortable integration
- Column order persistence in UI store with localStorage
- Visual drag handles and overlay for list reordering
- Comprehensive JSDoc documentation for all components and hooks
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
- Hidden cards indicator and expandable list for out-of-range timeline cards
- Created HiddenCardsIndicator component with dual-side directional indicators
- Added useDateRange and useHiddenCards hooks for better component separation
- Created usePositioning hook with full card positioning logic
- Created TimelineCard component for individual card rendering
- Created TimelineHeader component with zoom controls and navigation
- Created TimelineGrid component for date headers and grid lines
- Export and Import board data functionality
- Visual squares for hidden cards indicator
- Collapsible parent swimlanes with expand/collapse functionality
- Keyboard shortcuts for timeline navigation (dedicated hook)
- IndividualCardSwimlane component for better card organization
- SubCardSwimlane component for nested card management
- MiniCardTooltip dedicated component for improved UX
- Comprehensive timeline state management with per-board persistence
- Board-level label management system
- Comprehensive table view with sorting and column visibility
- Number-based priority system (1-100) for cards
- Enhanced search and filtering across all views with advanced options
- Compact search bar mode for header integration
- Expandable description with auto-resizing and visual indicators

### Changed
- Enhanced drag-and-drop system to support both card and list reordering
- Improved kanban view with persistent column ordering
- Updated documentation with comprehensive guides and security policy
- Enhanced code comments and inline documentation
- Removed pre-populated labels from new boards - boards now start with empty labels array
- Fixed dropdown menu behavior in kanban list headers to close when clicking outside or other menus
- Only user-created labels will exist in boards going forward
- Enhanced timeline UI styling with improved button contrast and active states
- Simplified timeline card positioning logic with direct calculations
- Enhanced month view with daily granularity and improved date labeling
- Fixed card stacking logic for out-of-range cards in timeline view
- Fixed day view card overlapping issue with proper vertical stacking
- Enhanced hidden cards with directional indicators (before/after) and performance optimizations
- TimelineView reduced from ~750 lines to 548 lines (27% reduction)
- Reduced welcome screen display time from 2 seconds to 500ms for faster app loading
- Fixed tooltip z-index issues by increasing to z-[9999] for proper layering
- Major UI restructuring: migrated sidebar management buttons to header hamburger menu
- Renamed BoardHeader component to Header with enhanced sharing functionality
- Added robust timeline date validation and error handling with automatic recovery
- Optimized currentBoard lookup in useBoard hook for better performance
- Fixed critical date serialization issue causing card misalignment after import and refresh
- Added robust Date object handling in localStorage persistence with automatic cleanup
- Fixed timeline data disappearing after date navigation with zoom level validation
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
- Enhanced ListLane header with collapse indicators and task count
- Improved board item layout in Sidebar component
- Restored delete button positioning in Sidebar board items
- Added card completion feature and simplified date handling
- Refactored kanban view with component extraction
- Organized timeline exports and reset version
- Migrated Card component to dnd-kit drag and drop
- Consolidated UI components and removed kanban duplicates
- Improved kanban drag and drop with optimistic updates
- Added drag activation constraint to prevent accidental drags
- Improved drag and drop collision detection and droppable areas
- Added list management functionality and improved UI text
- Improved kanban menu management and clean default data
- Enhanced timeline task color system with hex color mapping and contrast calculation
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
- Reorganized changelog unreleased section for better categorization
- Reorganized header and sidebar components into modular architecture
- Simplified export data function with spread operator
- Fixed card completion state preservation during import
- Modularized card components for improved maintainability
- Modularized search and filter components for improved maintainability
- Modularized sidebar components for improved maintainability
- Reorganized modal functionality into dedicated modal module
- Complete component modularization with dedicated board header, sidebar, and sharing modules
- Reorganized task card and task modal components with proper separation of concerns
- Consolidated search and filter functionality under unified searchAndFilter module
- Enhanced component exports and imports for better maintainability
- Removed duplicate components and consolidated shared utilities
- Improved code organization with dedicated hooks and services modules
- Optimized drag-and-drop performance with sensor memoization
- Disabled drag-and-drop when card modal is open to prevent conflicts
- Improved conditional rendering logic for better component separation
- Enhanced sensor configuration with stable references
- Optimized kanban view performance during modal interactions
- Prevented accidental label deletion when not editing

### Fixed
- Improved drag handle positioning and visual feedback
- Better state management for drag operations
- Enhanced type safety in drag-and-drop components
- Kanban list dropdown menus now properly close when clicking outside the menu area
- Dropdown menus close when opening other list option buttons
- Improved menu state management across multiple lists
- CardModal label creation with proper ID generation
- TypeScript type casting issues in select elements
- Form state management robustness in card editing
- Stop automatic board creation on page refresh
- Remove mock data and enable proper date editing for cards
- Correct hidden cards placement in empty swimlanes
- Timeline layout and card positioning issues
- Label duplication during file import (labels now properly reused across cards)
- Hardcoded mock data for Homepage redesign card
- Card positioning and date calculation issues
- ListLane import path case sensitivity
- Timeline header gap and scrolling content behind it
- Add list input squashing and implemented auto-scroll
- Completed cards showing red overdue styling instead of green
- Version number correction from 1.2.0 to 1.1.0
- Kanban list dropdown menus now properly close when clicking outside of menu area
- Dropdown menus close when opening other list option buttons
- Improved menu state management across multiple lists
- Removed pre-populated labels from new boards - boards now start with empty labels array
- Fixed dropdown menu behavior in kanban list headers to close when clicking outside or other menus
- Only user-created labels will exist in boards going forward
- Prevented accidental label deletion when not editing

### Refactoring
- Extracted MiniCardTooltip to dedicated component
- Major refactor: Main swimlanes with sub-card swimlanes architecture
- TimelineView component breakdown into smaller, focused components
- Improved code organization with dedicated hooks and utilities
- Enhanced component separation for better maintainability
- Added comprehensive JSDoc comments and documentation to all components and utilities
- Improved MemberManagement component code organization and readability
- Enhanced timeline hidden cards with interactive tooltips and consistent logic
- Optimized timeline hidden cards calculation performance for large datasets
- Enhanced timeline positioning with debug logging for troubleshooting
- Improved TypeScript type safety in UI store functions
- Removed IndividualCardSwimlane component to simplify timeline architecture
- Enhanced TimelineHeader with invalid date detection and navigation safety
- Enhanced timeline date handling with comprehensive debugging and validation
- Enhanced timeline positioning with comprehensive date validation and string-to-Date conversion
- Improved hidden cards logic with proper date validation and error handling
- Added comprehensive debugging and fallback mechanisms for timeline state management

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
- **Multiple Views**: Kanban, Calendar, Timeline, and Table views
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
