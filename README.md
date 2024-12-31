# Project Dashboard Mindeo

A modern KPI and project management dashboard built with React, TypeScript, and Tailwind CSS.

## Development Rules and Standards

This project follows strict development rules and standards defined in `.windsurf/rules.md`. These rules ensure consistency, maintainability, and proper data structure across the project.

### 🔍 Checking Rules

Before starting development:
```bash
cat .windsurf/rules.md
```

### 📋 Key Areas Covered by Rules

- Data Structure Hierarchy
- Component Organization
- TypeScript Usage
- State Management
- Error Handling
- Testing Requirements
- Documentation Standards
- Git Workflow

### ✅ Rule Compliance

All changes must comply with the defined rules. The pre-commit hook will validate:
- Code structure
- Naming conventions
- TypeScript usage
- Documentation requirements

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up pre-commit hooks:
```bash
npm run prepare
```

3. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── api/           # API integration (Airtable)
├── components/    # React components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── lib/          # Third-party integrations
├── pages/        # Page components
├── schemas/      # Zod schemas
├── types/        # TypeScript types
└── utils/        # Helper functions
```

## Data Structure

The project follows a hierarchical data structure:

```
Function Level
└── Problems
    └── Categories
        └── Sub-Problems
            └── Items
                └── Actions
```

See `.windsurf/rules.md` for detailed structure documentation.

## Contributing

1. Read `.windsurf/rules.md` thoroughly
2. Follow the defined structure and conventions
3. Ensure all tests pass
4. Submit PRs with proper documentation

## License

[Your License]
