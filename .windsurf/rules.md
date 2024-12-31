# Project Dashboard Mindeo - Development Rules

## IMPORTANT: Session Initialization Rules
1. This file MUST be read at the start of every chat session
2. Location: `.windsurf/rules.md`
3. Command to check rules:
```bash
cat .windsurf/rules.md
```
4. All code changes must comply with these rules
5. Reference relevant rules when making changes
6. Acknowledge rule compliance in responses

## Rule Validation Checklist
- [ ] Read and understood all rules
- [ ] Verified data structure hierarchy compliance
- [ ] Checked naming conventions
- [ ] Confirmed component organization
- [ ] Validated TypeScript usage
- [ ] Verified state management patterns
- [ ] Checked error handling implementation
- [ ] Confirmed documentation standards

## Project Context
A modern KPI and project management dashboard built with React, TypeScript, and Tailwind CSS, integrating with Airtable for data management. The application provides KPI monitoring, impact simulation, project planning, and audit tracking capabilities.

Key Features:
- KPI monitoring and impact simulation
- Project plan management with task tracking
- Audit system with compliance tracking
- Performance metrics visualization
- Administrative controls

## Code Organization

### Directory Structure
```
src/
├── api/           # API integration (Airtable)
├── components/    
    ├── ui/        # Shadcn/Radix components
    ├── layout/    # Layout components
    ├── simulator/ # Impact simulator components
    ├── project/   # Project management components
    ├── audit/     # Audit components
├── contexts/      # React contexts
├── hooks/        # Custom React hooks
├── lib/          # Third-party integrations
├── pages/        # Page components
├── schemas/      # Zod schemas
├── types/        # TypeScript types
└── utils/        # Helper functions
```

### Component Rules
1. Use functional components with TypeScript
2. Implement proper prop validation with TypeScript interfaces
3. Use Zod for runtime data validation
4. Follow the Single Responsibility Principle
5. Implement error boundaries for component trees
6. Use React.memo() for expensive renders

### Hook Rules
1. Prefix all hooks with "use"
2. Implement proper cleanup in useEffect
3. Use React Query for data fetching
4. Handle loading and error states explicitly
5. Document hook parameters and return values
6. Add unit tests for complex hooks

### State Management
1. Use React Query for server state
2. Use React Context for UI state
3. Implement proper cleanup
4. Handle loading states consistently
5. Use Zod for data validation
6. Cache invalidation strategies

### TypeScript Usage
1. Use strict TypeScript configuration
2. Define interfaces for all data structures
3. Use Zod for runtime validation
4. Avoid any and type assertions
5. Use discriminated unions for state
6. Example:
```typescript
interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
}
```

### Styling Rules
1. Use Tailwind CSS for styling
2. Follow dark theme color scheme:
   - Background: #0F1012
   - Card Background: #1C1D24
   - Primary: violet-400
   - Error: red-400
   - Success: green-400
3. Use Shadcn UI components
4. Maintain consistent spacing
5. Implement responsive design

### API Integration
1. Use React Query for data fetching
2. Implement proper error handling
3. Use Zod for response validation
4. Cache responses appropriately
5. Handle loading states
6. Example:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: async () => {
    const response = await fetchData();
    return validateWithZod(response);
  }
});
```

### Error Handling
1. Use Zod for data validation
2. Implement error boundaries
3. Log errors with context
4. Provide user-friendly messages
5. Handle API errors gracefully
6. Example:
```typescript
try {
  const result = validateKPI(data);
  if (!result.success) {
    console.error('Validation failed:', result.errors);
    return null;
  }
} catch (error) {
  // Handle and log error
}
```

### Testing
1. Write unit tests for hooks
2. Test data transformations
3. Test error handling
4. Test UI components
5. Use proper mocking
6. Example:
```typescript
describe('useImpactSimulator', () => {
  it('should handle invalid data', () => {
    // Test implementation
  });
});
```

### Git Workflow
Commit Message Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code refactoring
- style: Style/formatting changes
- test: Test changes
- docs: Documentation
- chore: Maintenance

### Documentation
1. Maintain README with setup
2. Document API interactions
3. Document component props
4. Include examples
5. Document state patterns
6. Keep inline documentation minimal

### Data Structure and Hierarchy

#### Core Data Hierarchy
```
Function Level (e.g., Marketing, Sales, Content)
└── Problems
    └── Categories
        └── Sub-Problems
            └── Items
                └── Actions
```

#### Detailed Structure
1. Function Level
   - Fonction_Name (e.g., "Content", "Marketing", "Sales")
   - Score_Final_Fonction (0-10)
   - Nbr_KPIs
   - Nbr_KPIs_Alert

2. Problems Level
   - Problems_Name (Main problem area)
   └── Categorie_Problems_Name (Problem category)
       └── Sub_Problems_Name (Specific issue)
           └── Sub_Problems_Text (Detailed description)
               └── Items (Actionable items)
                   ├── Item_ID
                   ├── Item_Name
                   ├── Status (Not Started/In Progress/Completed)
                   ├── Criticality (High/Medium/Low)
                   ├── Action_Required
                   ├── Playbook_Link (optional)
                   └── KPIs
                       ├── KPIs_Name[]
                       └── KPIs_Status_[]

3. Actions Level
   └── ActionItem
       ├── id
       ├── action
       ├── actionWeek
       ├── status
       ├── itemName
       ├── functionName
       ├── progress
       ├── estimatedHours
       └── actualHours

#### Structure Rules
1. Every Function must have:
   - At least one Problem
   - A valid Score_Final_Fonction
   - Linked KPIs

2. Every Problem must have:
   - At least one Category
   - Clear naming convention
   - Proper hierarchy

3. Every Sub-Problem must have:
   - Clear description
   - At least one Item
   - Measurable criteria

4. Every Item must have:
   - Unique ID
   - Valid Status
   - Defined Criticality
   - Clear Action_Required
   - At least one KPI

5. Every Action must have:
   - Estimated hours
   - Clear status
   - Progress tracking
   - Parent item reference

#### Example Implementation
```typescript
// Function structure
interface Function {
  Fonction_Name: string;
  Score_Final_Fonction: number;
  Problems: Problem[];
  KPIs: KPI[];
}

// Problem structure
interface Problem {
  Problems_Name: string;
  Categories: Category[];
}

// Category structure
interface Category {
  Categorie_Problems_Name: string;
  Sub_Problems: SubProblem[];
}

// Sub-Problem structure
interface SubProblem {
  Sub_Problems_Name: string;
  Sub_Problems_Text: string;
  Items: Item[];
}

// Item structure
interface Item {
  Item_ID: string;
  Item_Name: string;
  Status: 'Not Started' | 'In Progress' | 'Completed';
  Criticality: 'High' | 'Medium' | 'Low';
  Action_Required: string;
  Playbook_Link?: string;
  KPIs: {
    KPIs_Name: string[];
    KPIs_Status: string[];
  };
}
```

#### Real-World Example
```
Function: Marketing
├── Problems: Lead Generation
│   ├── Category: Acquisition
│   │   ├── Sub-Problem: Low Conversion Rate
│   │   │   └── Items:
│   │   │       ├── Landing Page Optimization
│   │   │       │   ├── Status: In Progress
│   │   │       │   ├── Criticality: High
│   │   │       │   └── KPIs: ['Conversion Rate', 'Bounce Rate']
│   │   │       └── A/B Testing Implementation
│   │   │           ├── Status: Not Started
│   │   │           ├── Criticality: Medium
│   │   │           └── KPIs: ['Test Success Rate']
│   │   └── Actions:
│   │       ├── Implement Heat Mapping
│   │       │   ├── Status: In Progress
│   │       │   ├── Progress: 60%
│   │       │   └── Hours: 8/10
│   │       └── Setup A/B Tests
│   │           ├── Status: Not Started
│   │           ├── Progress: 0%
│   │           └── Hours: 0/20

Function: Sales
├── Problems: Pipeline Management
│   ├── Category: Deal Closure
│   │   ├── Sub-Problem: Long Sales Cycle
│   │   │   └── Items:
│   │   │       ├── Sales Process Optimization
│   │   │       │   ├── Status: In Progress
│   │   │       │   ├── Criticality: High
│   │   │       │   └── KPIs: ['Cycle Length', 'Win Rate']
│   │   └── Actions:
│   │       ├── Implement Sales Automation
│   │       │   ├── Status: In Progress
│   │       │   ├── Progress: 40%
│   │       │   └── Hours: 15/30

Function: Content
├── Problems: Content Quality
│   ├── Category: SEO
│   │   ├── Sub-Problem: Low Rankings
│   │   │   └── Items:
│   │   │       ├── Keyword Optimization
│   │   │       │   ├── Status: Not Started
│   │   │       │   ├── Criticality: High
│   │   │       │   └── KPIs: ['SERP Position', 'Organic Traffic']
```

#### Validation Rules
1. Names and IDs:
   - Function names must be unique
   - Item IDs must be unique across all functions
   - Problem names must be unique within a function

2. Status Transitions:
   - Items can only move forward in status (Not Started → In Progress → Completed)
   - Status changes must be logged
   - Completed items cannot be reverted

3. KPI Linkages:
   - Every item must have at least one KPI
   - KPIs must exist in the KPI database
   - KPI status must be valid

4. Progress Tracking:
   - Progress must be between 0-100
   - Estimated hours must be positive
   - Actual hours cannot exceed estimated by more than 50%

### Performance
1. Use React.memo() wisely
2. Implement proper memoization
3. Optimize re-renders
4. Monitor bundle size
5. Use code splitting
6. Implement proper caching

### Security
1. Validate all inputs
2. Sanitize data
3. Handle sensitive data properly
4. Implement proper CORS
5. Use environment variables
6. Follow security best practices

### Accessibility
1. Use semantic HTML
2. Implement ARIA attributes
3. Ensure keyboard navigation
4. Maintain color contrast
5. Test with screen readers
6. Follow a11y best practices
