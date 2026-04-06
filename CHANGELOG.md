# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Add inline editing capability for checklist items in task modal
- Add edit buttons and save/cancel controls for checklist items
- Make checklist item text clickable to initiate editing
- Add keyboard shortcuts (Enter to save, Escape to cancel) for checklist item editing
- Modernize checklist item styling with card-based design and smooth transitions
- Add custom checkbox styling with SVG checkmark and hover effects
- Implement smart button visibility that reveals action buttons on hover
- Add color-coded hover states for edit (indigo) and delete (red) actions
- Add label name tooltips on hover for existing colors in ColorPicker
- Increase custom color button plus symbol size for better visibility
- Add react-colorful package for improved color picker customization
- Center HexColorPicker within its container for better layout

### Fixed
- Fix label color display in task modal to show proper background colors
- Ensure label text has proper contrast (white/black) based on background color

### Changed
- Rename "Suggested Colors" to "Existing Colors" for clarity
- Keep ColorPicker dropdown open for continuous color selection
- Replace small X close button with prominent Close button
- Remove redundant Apply button (colors apply automatically)
- Replace ChromePicker with HexColorPicker for better styling flexibility
- Fix state synchronization issues by using value prop consistently
- Simplify event handlers for controlled component behavior

## [1.7.0] - 2026-04-05

### Added
- Implement comprehensive hex color system to replace Tailwind CSS classes
- Add hybrid ColorPicker component with basic colors and custom color wheel
- Create color utility functions for conversion, contrast calculation, and brightness adjustment
- Implement data migration utilities for backward compatibility with existing Tailwind colors
- Add BASIC_LABEL_COLORS and LIST_COLORS_HEX constants with curated hex palettes
- Add extensive test coverage for color system (1600+ tests)
- Install react-color package for advanced color selection functionality
- Complete list color system with hex support and contrast calculation in KanbanList components
- Convert SearchAndFilterDropdown from Tailwind classes to inline hex styles
- Enhance ColorPicker with smart color suggestions based on existing board labels
- Move Basic Colors from dropdown to main label form for improved UX
- Add custom color button (+) in Basic Colors grid for quick access to advanced options
- Implement portal-based ColorPicker dropdown to fix z-index and positioning issues
- Create ColorPickerPortal component to handle click-outside event conflicts
- Add parentRef positioning system to align dropdown with modal boundaries
- Update TaskModalLabelForm to pass existing labels for color suggestions
- Fix test mocks and expectations for hex-based color system
- Update all label display components to use hex colors with automatic contrast
- Replace Tailwind color classes with inline styles using getContrastColor utility
- Fix Calendar View complex color logic to use hex-based lighten function
- Update label management hooks to use BASIC_LABEL_COLORS with hex support
- Add proper color utility imports for contrast calculation across components
- Ensure consistent text readability with automatic black/white contrast
- Add keyboard navigation support to ColorPicker with Enter key functionality
- Add test:failing npm script for re-running only failed tests

### Refactored
- Remove legacy Tailwind color conversion utilities and deprecated constants
- Delete tailwindToHex function and TAILWIND_TO_HEX_MAP from colorUtils.ts
- Remove entire migrationUtils.ts file and related test infrastructure
- Update TimelineTooltip to use direct hex colors without conversion layer
- Simplify BoardHeaderImportExport to work with hex-only color system
- Clean up test files to reflect new hex-based architecture
- Remove disabled test files and unused legacy code references
- Optimize TimelineTooltip performance by replacing inline styles with Tailwind classes

### Fixed
- Fix timeline date navigation reactivity by replacing getTimelineState with individual Zustand selectors
- Prevent infinite loop and "Maximum update depth exceeded" errors in TimelineView component
- Add stable fallback constants to prevent unnecessary re-renders in timeline components
- Update TimelineView tests to support new selector pattern and comprehensive date navigation testing
- Prevent label duplication when importing exported boards by excluding labels property from card exports
- Fix failing unit tests across multiple components by updating test mocks and expectations
- Update SearchAndFilter tests to handle board-scoped UI store selectors correctly
- Add missing scroll position functions to KanbanView test mocks
- Fix TaskModal form type test to expect null instead of undefined for priority validation
- Refactor UIStore tests to use boardId parameter and proper filterState structure
- Prevent vertical layout shift in calendar view when navigating between months with different name lengths
- Add calendar overflow modal for viewing all tasks when day cells contain more than 3 tasks
- Implement clickable "+N more" indicator with hover effects in calendar view
- Create DayTasksModal component with proper label color coding and task click functionality
- Add modal stacking behavior so closing task modal returns to list modal instead of calendar
- Enhance day tasks modal with colored indicator bars on left edge of task items
- Remove unwanted border from kanban lists by eliminating border classes from KanbanList container
- Refactor modal styling from inline CSS to Tailwind classes with proper color mapping
- Add comprehensive RGB color mapping for proper CSS color values in indicator bars
- Fix flaky ColorPicker test by adding proper async handling and focus management
- Adjust contrast color threshold from 0.5 to 0.35 for better text readability on medium-light colors
- Improve ColorPicker accessibility with proper tabIndex attributes and focus management
- Fix TypeError when clicking label + button by handling undefined label data in import and filtering
- Add defensive label filtering to prevent toLowerCase() errors on undefined text properties
- Enhance board import logic to support labels stored as strings (label IDs) in addition to label objects

## [1.6.0] - 2026-03-27

### Added
- Implement per-board filters instead of global filters to prevent cross-board confusion
- Add board-specific filter state storage with individual selector patterns
- Add getFilterState helper function for accessing board-specific filter settings
- Add comprehensive test suites for Timeline components (TimelineGrid, TimelineHeader, TimelineTask, TimelineTooltip)
- Add extensive board component test coverage for BoardHeader, BoardShare, and BoardSidebar components
- Add comprehensive test coverage for board sharing components (InviteModal, JoinBoardModal, MemberManagement)
- Add test utilities and hooks for clipboard detection, drag-and-drop, and invitation utilities
- Add workflow documentation for code review processes
- Prevent context menu from reopening when right-clicking on backdrop overlay
- Add comprehensive unit tests for context menu right-click prevention behavior
- Extend task priority range from 1-100 to 0-100 to support lowest priority level
- Add proper handling for empty priority values in task modal form
- Add comprehensive test coverage for priority field validation and edge cases
- Add Archive button to task modal footer with destructive styling and proper danger zone placement
- Add comprehensive unit tests for archive functionality in task modal handlers
- Add comprehensive unit tests for kanban scroll position functionality (28 tests across 5 test suites)
- Add test coverage for scroll position storage, restoration, and click handler propagation in kanban components

### Changed
- Organize coverage analysis files by moving scripts to dedicated scripts/ folder
- Improve project structure by consolidating coverage tools and utilities
- Enhance existing test suites with edge cases, component structure validation, and interaction testing
- Fix inline-input test behavior to properly handle Escape key interactions

### Fixed
- Fix kanban view scroll position reset when opening card modals
- Prevent visual jank by maintaining persistent scroll container structure
- Implement scroll position tracking in UI store for consistent state management
- Add proper card click handlers throughout kanban component hierarchy
- Fix infinite loop and "Maximum update depth exceeded" errors in filter components
- Replace object-creating selectors with stable individual selectors to prevent re-renders
- Clean up temporary files and documentation from coverage optimization process
- Remove duplicate coverage files and outdated test snapshots
- Remove outdated KanbanCardsContainer test snapshot
- Fix modal reopening issue when saving cards by preventing URL-based reopening race conditions
- Resolve task modal race condition for newly created cards with polling mechanism
- Enhance search and filter dropdown positioning with portal management and viewport boundary detection

## [1.5.0] - 2026-03-11

### Added
- Add comprehensive Jest testing framework with Testing Library integration
- Configure test coverage thresholds (80%) and Next.js compatibility
- Add test suites for board store, UI store, hooks, and utility functions
- Include proper mocking setup for Next.js router and browser APIs
- Add comprehensive UI component test coverage for button, modal, drag-overlay, inline-input, and input components
- Cover all component variants, sizes, accessibility features, and edge cases in UI tests
- Add comprehensive board component test coverage for BoardHeader, BoardSidebar, TaskCard, and TaskModal
- Test component composition, conditional rendering, and user interaction scenarios for board components
- Add comprehensive archive modal test coverage for ArchiveModal and ArchivedCardItem components
- Test modal rendering, archived cards display, delete confirmation, and unarchive functionality
- Add comprehensive board sharing test coverage for InviteModal, JoinBoardModal, and MemberManagement components
- Test invite creation, board joining workflows, and member management functionality
- Add comprehensive search and filter test coverage for SearchAndFilter, SearchAndFilterInput, and SearchAndFilterPortal components
- Test search functionality, filtering options, input handling, and portal rendering
- Add comprehensive view component test coverage for KanbanView, CalendarView, TimelineView, and TableView components
- Test all board view types with proper data rendering, user interactions, and view-specific functionality
- Add comprehensive app component test coverage for main page and root layout components
- Test page rendering, component composition, layout structure, and Next.js app integration
- Add component and utility test coverage for TaskModalForm, InviteForm, and filterUtils
- Fix inline-input test to properly handle Escape key behavior and form interactions
- Add comprehensive timeline component test coverage for TimelineGrid, TimelineHeader, TimelineTask, and TimelineTooltip
- Enhance board component test suites with edge cases and interaction testing
- Improve board sharing and sidebar component test coverage
- Remove outdated KanbanCardsContainer test snapshot
- Enhance TaskModalForm test coverage with date inputs, validation, and completed styling tests
- Add comprehensive test suites for kanban components, task modal sub-components, and search/filter components
- Improve overall test coverage to meet 80% threshold requirements across all metrics
- Add URL parameter support for direct task modal access
- Support direct linking to specific cards via /board/[boardId]/card/[cardId] routes
- Automatically open task modal when card URL is accessed
- Set current board based on URL parameters
- Improve URL synchronization and modal handling
- Increase modal opening delay to ensure board is fully loaded
- Add URL cleanup logic for invalid board redirects
- Enhance modal functions with dynamic URL updates
- Implement proper URL synchronization with browser history
- Fix circular dependency between UI and board stores
- Enhance URL synchronization across board operations
- Add URL updates when switching between boards
- Preserve card URLs during board navigation
- Navigate to new board URLs after board creation
- Handle URL redirection when deleting current board
- Switch to next available board or root when current board is deleted
- Fix variable name inconsistency in UI store close modal function

### Changed
- Enhanced checklist management with immediate store synchronization for all CRUD operations
- Improved "Add checklist" button visibility logic to only show when no checklists exist
- Added comprehensive JSDoc documentation for useTaskModalChecklist hook
- Make entire checklist header clickable for expand/collapse functionality
- Add "Add another checklist" button when checklists already exist
- Enhance progress bar with full-height section and distinct background
- Fix checklist renaming by adding immediate store synchronization
- Prevent button click conflicts with header toggle using event.stopPropagation
- Remove duplicate modal closing logic and optimize timing
- Clean up unused imports and state in main page component
- Optimize modal closing timing for faster response and proper sequencing
- Improve URL handling and prevent modal parsing loops
- Add explicit type definitions for UI state interface properties
- Prevent checklist sync errors when card is deleted
- Enhance setCurrentBoard with global flag checking to prevent modal reopening
- Only update URLs when board actually changes and not during modal operations
- Restructure modal functions to set state first, then update URL
- Add isJSONImportMode state property for better state management
- Fix JSDoc comment parameter name inconsistency


### Fixed
- Prevent URL parsing loops when closing task modal
- Add closeCardModalWithoutUrlUpdate function to avoid immediate URL changes
- Implement global closing flags to prevent dynamic route reopening
- Add delayed URL updates with proper timing to ensure modal closes first
- Fix infinite loop between modal close and URL parsing logic
- Update all modal handlers to use custom close logic

## [1.4.0] - 2026-03-09

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
- Multiple checklists per card with expandable sections and individual progress tracking
- TaskModalMultiChecklistManager for comprehensive checklist management

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
- Refactored board store into modular slice-based architecture for improved maintainability
- Added data migration support from single checklist to multiple checklists format
- Improved clipboard detection with better focus handling for context menus
- Enhanced paste UX with loading states and always-visible paste button
- Optimized kanban performance with memoized filtered cards
- Auto-close context menu after successful copy/download actions
- Improved context menu positioning with accurate viewport bounds detection
- Added scrolling support for menus that exceed viewport height
- Simplified context menu item labels for cleaner interface
- Consolidated positioning logic in dedicated utils function
- Removed unused cover and upload JSON options from context menu

### Fixed
- Added tooltip to paste button for better UX consistency
- Improved JSON parsing error handling in clipboard detection to prevent console errors
- Removed emoji from Features heading in README for cleaner formatting
- Add missing description field in createCardFromData to prevent data loss during card creation

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
