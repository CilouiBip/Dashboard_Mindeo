import { CategoryMetrics } from './types';
import { PriorityItem } from '../../../api/airtable';

export const calculateCategoryMetrics = (items: PriorityItem[]): CategoryMetrics[] => {
    // Grouper les items par catégorie (Marketing, Content)
    const categorizedItems = items.reduce((acc, item) => {
        const category = item.Fonction_Name;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, PriorityItem[]>);

    // Calculer les métriques pour chaque catégorie
    return Object.entries(categorizedItems).map(([categoryName, items]) => {
        const totalTasks = items.length;
        const completedTasks = items.filter(item => item.Status === 'Completed').length;
        
        // Calculer la progression moyenne
        const progressSum = items.reduce((sum, item) => {
            return sum + (item.Progress || 0);
        }, 0);
        const averageProgress = totalTasks > 0 ? Math.round(progressSum / totalTasks) : 0;

        // Calculer les temps
        const estimatedTime = items.reduce((sum, item) => {
            return sum + (item.Estimated_Hours || 0);
        }, 0);
        
        const actualTime = items.reduce((sum, item) => {
            return sum + (item.Actual_Hours || 0);
        }, 0);

        return {
            categoryName,
            totalTasks,
            completedTasks,
            averageProgress,
            estimatedTime,
            actualTime
        };
    });
};
