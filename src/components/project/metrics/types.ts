export interface PerformanceMetrics {
    Progress: number;
    Estimated_Hours: number | null;
    Actual_Hours: number | null;
}

export interface CategoryMetrics {
    categoryName: string;    // 'Marketing' ou 'Content'
    totalTasks: number;
    completedTasks: number;
    averageProgress: number;
    estimatedTime: number;
    actualTime: number;
}
