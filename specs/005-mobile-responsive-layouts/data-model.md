# Data Model: Mobile Responsive Viewport Specification

No new data entities required. Responsive logic manages existing entities:
- **Board/Kanban**: Same `boardStore` data. Responsive CSS changes visual arrangement.
- **Filters/Metadata**: Existing data, visual logic moved into `uiStore` state for drawer/accordion toggling.
