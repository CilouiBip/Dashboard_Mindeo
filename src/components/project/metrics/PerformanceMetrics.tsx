import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { CategoryMetrics } from './types';

interface PerformanceMetricsProps {
    categories: CategoryMetrics[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ categories }) => {
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '12px'
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
                Métriques de Performance
            </Typography>
            
            {categories.map((category) => (
                <Box key={category.categoryName} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {category.categoryName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {category.averageProgress}%
                        </Typography>
                    </Box>
                    
                    <LinearProgress 
                        variant="determinate" 
                        value={category.averageProgress} 
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(148, 163, 184, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#7c3aed'
                            }
                        }}
                    />
                    
                    <Box sx={{ 
                        mt: 1, 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        color: '#94a3b8',
                        fontSize: '0.75rem'
                    }}>
                        <span>{category.completedTasks}/{category.totalTasks} tâches</span>
                        <span>
                            Temps moyen: {
                                category.actualTime > 0 
                                    ? `${(category.actualTime / category.completedTasks).toFixed(1)}h`
                                    : 'N/A'
                            }
                        </span>
                    </Box>
                </Box>
            ))}
        </Paper>
    );
};

export default PerformanceMetrics;
