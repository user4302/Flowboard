# Contributing to Flowboard

Thank you for your interest in contributing to Flowboard! This guide will help you get started with contributing to our project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Basic knowledge of React, TypeScript, and Next.js

### Setup
1. Fork the repository on GitLab
2. Clone your fork locally:
   ```bash
   git clone https://gitlab.com/[YOUR_USERNAME]/coding/next-js/flowboard.git
   cd flowboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Workflow

### 1. Make Changes
- Follow the existing code structure and patterns
- Use TypeScript for all new code
- Add appropriate JSDoc comments
- Test your changes thoroughly

### 2. Code Quality
Run the linter before committing:
```bash
npm run lint
```

### 3. Commit Messages
Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:
```bash
git commit -m "feat(kanban): add list drag-and-drop reordering"
```

### 4. Submit Changes
1. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Create a Merge Request on GitLab
3. Provide a clear description of your changes
4. Link any relevant issues

## 🎯 Contribution Areas

### Features We Welcome
- New view types (Calendar, Timeline improvements)
- Enhanced card management
- Better collaboration features
- Performance optimizations
- Accessibility improvements
- Mobile app responsiveness

### Bug Reports
- Use GitLab Issues for bug reports
- Provide clear reproduction steps
- Include browser and OS information
- Add screenshots if applicable

### Documentation
- Improve README sections
- Add inline code comments
- Create usage examples
- Update API documentation

## 🏗️ Code Standards

### TypeScript
- Use interfaces for all props and state
- Prefer explicit types over inference
- Use generic types where appropriate
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Keep components focused and reusable
- Use proper prop destructuring

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Maintain consistency with dark/light themes
- Use responsive design patterns

### State Management
- Use Zustand for global state
- Keep state minimal and focused
- Use proper TypeScript types
- Follow existing store patterns

## 🧪 Testing

### Manual Testing Checklist
- [ ] Feature works in both light and dark themes
- [ ] Responsive design works on mobile
- [ ] Drag-and-drop functions correctly
- [ ] Search and filtering work properly
- [ ] No console errors
- [ ] Accessibility features work

### Browser Testing
Test in at least:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Merge Request Guidelines

### Before Submitting
- Ensure your code follows our standards
- Test thoroughly
- Update documentation if needed
- Rebase your branch if necessary

### MR Description
Include:
- Clear description of changes
- Why this change is needed
- How to test the changes
- Any breaking changes
- Related issues

### Review Process
1. Automated checks must pass
2. At least one team member review
3. Address all feedback
4. Maintain clean commit history

## 🚫 What Not to Do

- Don't commit directly to main branch
- Don't include sensitive information
- Don't make breaking changes without discussion
- Don't ignore code quality standards
- Don't submit incomplete features

## 🤝 Community Guidelines

### Be Respectful
- Treat everyone with respect
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Be patient and understanding

### Communication
- Use GitLab Issues for questions
- Be clear and concise in descriptions
- Provide context for your changes
- Ask for help when needed

## 🏆 Recognition

Contributors are recognized in:
- Our contributors list
- Release notes for significant contributions
- Special thanks in project announcements

## 📞 Getting Help

If you need help:
1. Check existing issues and documentation
2. Create a new issue on GitLab
3. Join our discussions (if enabled)
4. Ask questions in merge requests

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License as the project.

---

Thank you for contributing to Flowboard! Your contributions help make this project better for everyone. 🎉
