# Contributing to Not Store

We love your input! We want to make contributing to Not Store as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Conventional Commits

We follow [Conventional Commits](https://conventionalcommits.org/) specification for commit messages:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
feat: add shopping cart functionality
fix: resolve product image loading issue
docs: update API documentation
style: format code with prettier
refactor: optimize Redux selectors
test: add cart slice unit tests
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React

- Use functional components with hooks
- Prefer custom hooks for reusable logic
- Use React.memo for performance optimization when needed
- Follow the component file structure:
  ```
  ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.module.css
  └── index.ts
  ```

### CSS

- Use CSS Modules for component styles
- Follow BEM naming convention within modules
- Use CSS custom properties for theming
- Mobile-first responsive design

### File Organization

```
src/
├── core/           # Core functionality (store, API, UI components)
├── features/       # Feature-based modules
├── layouts/        # Layout components
├── utils/          # Utility functions
└── assets/         # Static assets
```

## Testing

- Write unit tests for utility functions
- Write integration tests for Redux slices
- Write component tests for complex UI logic
- Ensure all tests pass before submitting PR

## Code Quality

### ESLint Rules

We use strict ESLint configuration:

- No `any` types without explicit reason
- Prefer `@ts-expect-error` over `@ts-ignore`
- Follow React Hooks rules
- Ensure React Fast Refresh compatibility

### Pre-commit Hooks

We use Husky for pre-commit hooks:

- ESLint check and auto-fix
- Prettier formatting
- Commit message validation

## Performance Guidelines

- Use React.lazy() for code splitting
- Implement skeleton loading for better UX
- Use React Window for large lists
- Optimize images with BlurHash placeholders
- Minimize bundle size

## Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/mikailipek/contest/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please provide:

- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Any relevant mockups or examples

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.
