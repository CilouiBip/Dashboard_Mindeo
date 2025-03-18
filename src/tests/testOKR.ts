import { CreateOKRInput } from '../lib/supabase/services/okrService';

export const testOKR: CreateOKRInput = {
  objective: "Improve Developer Productivity Q1 2024",
  status: "active",
  key_results: [
    {
      metric: "Code Review Time",
      target: 24,
      unit: "hours",
      current: 0,
      initiatives: [
        {
          title: "Implement automated code review checks",
          description: "Set up linting and formatting checks in CI/CD",
          status: "todo"
        }
      ]
    },
    {
      metric: "Test Coverage",
      target: 85,
      unit: "%",
      current: 0,
      initiatives: [
        {
          title: "Add unit tests to critical components",
          description: "Focus on business logic and data processing",
          status: "todo"
        }
      ]
    }
  ]
};
