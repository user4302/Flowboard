import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemberTabs } from '../MemberTabs';
import type { ActiveTab } from '../../../types';

describe('MemberTabs Component', () => {
  const defaultProps = {
    activeTab: 'pending' as ActiveTab,
    onTabChange: jest.fn(),
    pendingCount: 5,
    membersCount: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both tabs with correct labels', () => {
    render(<MemberTabs {...defaultProps} />);
    
    expect(screen.getByText('Pending Requests (5)')).toBeInTheDocument();
    expect(screen.getByText('Members (10)')).toBeInTheDocument();
  });

  it('highlights the active tab correctly', () => {
    render(<MemberTabs {...defaultProps} activeTab="pending" />);
    
    const pendingTab = screen.getByText('Pending Requests (5)');
    const membersTab = screen.getByText('Members (10)');
    
    expect(pendingTab).toHaveClass('border-b-2', 'border-indigo-500', 'text-indigo-600');
    expect(membersTab).not.toHaveClass('border-b-2', 'border-indigo-500');
  });

  it('highlights members tab when active', () => {
    render(<MemberTabs {...defaultProps} activeTab="members" />);
    
    const pendingTab = screen.getByText('Pending Requests (5)');
    const membersTab = screen.getByText('Members (10)');
    
    expect(membersTab).toHaveClass('border-b-2', 'border-indigo-500', 'text-indigo-600');
    expect(pendingTab).not.toHaveClass('border-b-2', 'border-indigo-500');
  });

  it('calls onTabChange when pending tab is clicked', () => {
    render(<MemberTabs {...defaultProps} />);
    
    const pendingTab = screen.getByText('Pending Requests (5)');
    fireEvent.click(pendingTab);
    
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('pending');
  });

  it('calls onTabChange when members tab is clicked', () => {
    render(<MemberTabs {...defaultProps} />);
    
    const membersTab = screen.getByText('Members (10)');
    fireEvent.click(membersTab);
    
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('members');
  });

  it('displays correct count when pending count is zero', () => {
    render(<MemberTabs {...defaultProps} pendingCount={0} />);
    
    expect(screen.getByText('Pending Requests (0)')).toBeInTheDocument();
  });

  it('displays correct count when members count is zero', () => {
    render(<MemberTabs {...defaultProps} membersCount={0} />);
    
    expect(screen.getByText('Members (0)')).toBeInTheDocument();
  });

  it('applies correct styling classes to container', () => {
    const { container } = render(<MemberTabs {...defaultProps} />);
    
    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass('flex', 'border-b', 'border-slate-200', 'dark:border-slate-700');
  });

  it('applies correct styling to inactive tabs', () => {
    render(<MemberTabs {...defaultProps} activeTab="pending" />);
    
    const membersTab = screen.getByText('Members (10)');
    expect(membersTab).toHaveClass('text-slate-600', 'hover:text-slate-900', 'dark:text-slate-400', 'dark:hover:text-slate-100');
  });

  it('applies transition classes to tabs', () => {
    render(<MemberTabs {...defaultProps} />);
    
    const tabs = screen.getAllByRole('button');
    tabs.forEach(tab => {
      expect(tab).toHaveClass('transition-colors');
    });
  });
});
