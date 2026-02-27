export const countActiveFilters = (filters: {
  searchTerm?: string;
  selectedLabels: string[];
  selectedMembers: string[];
  showOverdue: boolean;
  showCompleted: string;
  priorityThreshold: number | null;
  dueDateFilter: string;
}): number => {
  const {
    searchTerm,
    selectedLabels,
    selectedMembers,
    showOverdue,
    showCompleted,
    priorityThreshold,
    dueDateFilter
  } = filters;

  return [
    searchTerm ? 1 : 0,
    selectedLabels.length > 0 ? 1 : 0,
    selectedMembers.length > 0 ? 1 : 0,
    showOverdue ? 1 : 0,
    showCompleted !== 'all' ? 1 : 0,
    priorityThreshold !== null ? 1 : 0,
    dueDateFilter !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);
};

export const hasAnyActiveFilters = (filters: {
  searchTerm?: string;
  selectedLabels: string[];
  selectedMembers: string[];
  showOverdue: boolean;
  showCompleted: string;
  priorityThreshold: number | null;
  dueDateFilter: string;
}): boolean => {
  return countActiveFilters(filters) > 0;
};
