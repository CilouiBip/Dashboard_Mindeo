import { describe, it, expect } from 'vitest';
import { okrV2Service } from '../okrV2Service';

describe('OKR Flow Integration Test', () => {
    it('should create and link OKR components', async () => {
        // 1. Create an objective
        const objective = await okrV2Service.createObjective({
            title: "Améliorer l'expérience utilisateur du dashboard",
            description: "Rendre le dashboard plus intuitif et performant",
            status: 'active',
            quarter: '2025-Q1',
            ai_generated: false
        });

        expect(objective.data).toBeDefined();
        expect(objective.error).toBeNull();
        expect(objective.data?.title).toBe("Améliorer l'expérience utilisateur du dashboard");
        
        const objectiveId = objective.data?.id;
        expect(objectiveId).toBeDefined();

        // 2. Create a key result
        const keyResult = await okrV2Service.createKeyResult({
            objective_id: objectiveId!,
            title: "Réduire le temps de chargement moyen",
            description: "Optimiser les performances de chargement des pages",
            target_value: 2,
            current_value: 5,
            unit: 'secondes',
            status: 'in_progress'
        });

        expect(keyResult.data).toBeDefined();
        expect(keyResult.error).toBeNull();
        expect(keyResult.data?.title).toBe("Réduire le temps de chargement moyen");
        
        const keyResultId = keyResult.data?.id;
        expect(keyResultId).toBeDefined();

        // 3. Create an initiative
        const initiative = await okrV2Service.createInitiative({
            key_result_id: keyResultId!,
            title: "Implémenter le lazy loading des images",
            description: "Mettre en place le chargement différé des images pour améliorer les performances",
            status: 'proposed'
        });

        expect(initiative.data).toBeDefined();
        expect(initiative.error).toBeNull();
        expect(initiative.data?.title).toBe("Implémenter le lazy loading des images");

        // 4. Test fetching objectives for the quarter
        const objectives = await okrV2Service.getObjectives('2025-Q1');
        expect(objectives.data).toBeDefined();
        expect(objectives.error).toBeNull();
        expect(objectives.data).toHaveLength(1);
        expect(objectives.data?.[0].id).toBe(objectiveId);
    }, 10000); // Augmenter le timeout à 10s pour les appels API
});
