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
- Created useTimelinePositioning hook with full card positioning logic
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

## [1.1.0] - 2025-02-22

### Added
- Board deletion functionality with confirmation dialog
- Proper sidebar layout spacing on large screens
- Interactive placeholder actions for Team Members and Settings
- Complete Flowboard project management application
- Four switchable views: Kanban, Timeline, Calendar, and Table
- Drag-and-drop functionality using @dnd-kit
- Rich card management with labels, members, dates, and checklists
- Real-time search and filtering capabilities
- Dark/light theme support with system preference detection
- Responsive design for mobile, tablet, and desktop
- Local storage data persistence
- Comprehensive TypeScript type definitions
- Modern UI with indigo/teal color scheme
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
