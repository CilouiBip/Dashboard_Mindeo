import { AuditItem, HierarchyNode } from '../types/audit';

export const calculateMetrics = (items: AuditItem[]) => {
  const total = items.length;
  const completed = items.filter(item => item.Status === 'Completed').length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  const scores = items
    .map(item => item.Score)
    .filter((score): score is number => score !== undefined);
  const averageScore = scores.length > 0 
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
    : 0;

  return { completionRate, averageScore };
};

export const buildAuditHierarchy = (items: AuditItem[]): Record<string, HierarchyNode> => {
  console.log('Building hierarchy from items:', items);
  
  // Trier les items par Fonction_Name et Sub_ID_Order
  const sortedItems = [...items].sort((a, b) => {
    // D'abord trier par Fonction_Name
    if (a.Fonction_Name !== b.Fonction_Name) {
      return a.Fonction_Name.localeCompare(b.Fonction_Name);
    }
    // Ensuite par Sub_ID_Order (si disponible)
    const orderA = a.Sub_ID_Order ?? 999999;
    const orderB = b.Sub_ID_Order ?? 999999;
    return orderA - orderB;
  });
  
  const hierarchy: Record<string, HierarchyNode> = {};
  
  sortedItems.forEach(item => {
    const { Fonction_Name, Problems_Name, Sub_Problems_Text, Categorie_Problems_Name } = item;
    
    // Initialize function level
    if (!hierarchy[Fonction_Name]) {
      hierarchy[Fonction_Name] = {
        items: [],
        children: {},
        completionRate: 0,
        averageScore: 0
      };
    }
    hierarchy[Fonction_Name].items.push(item);
    
    // Initialize problem level
    const functionNode = hierarchy[Fonction_Name];
    if (!functionNode.children[Problems_Name]) {
      functionNode.children[Problems_Name] = {
        items: [],
        children: {},
        completionRate: 0,
        averageScore: 0
      };
    }
    functionNode.children[Problems_Name].items.push(item);
    
    // Initialize sub-problem level
    const problemNode = functionNode.children[Problems_Name];
    if (!problemNode.children[Sub_Problems_Text]) {
      problemNode.children[Sub_Problems_Text] = {
        items: [],
        children: {},
        completionRate: 0,
        averageScore: 0
      };
    }
    problemNode.children[Sub_Problems_Text].items.push(item);
    
    // Initialize category level
    const subProblemNode = problemNode.children[Sub_Problems_Text];
    if (!subProblemNode.children[Categorie_Problems_Name]) {
      subProblemNode.children[Categorie_Problems_Name] = {
        items: [],
        children: {},
        completionRate: 0,
        averageScore: 0
      };
    }
    subProblemNode.children[Categorie_Problems_Name].items.push(item);
  });

  // Calculate metrics for each level
  Object.values(hierarchy).forEach(functionNode => {
    const functionMetrics = calculateMetrics(functionNode.items);
    functionNode.completionRate = functionMetrics.completionRate;
    functionNode.averageScore = functionMetrics.averageScore;

    Object.values(functionNode.children).forEach(problemNode => {
      const problemMetrics = calculateMetrics(problemNode.items);
      problemNode.completionRate = problemMetrics.completionRate;
      problemNode.averageScore = problemMetrics.averageScore;

      Object.values(problemNode.children).forEach(subProblemNode => {
        const subProblemMetrics = calculateMetrics(subProblemNode.items);
        subProblemNode.completionRate = subProblemMetrics.completionRate;
        subProblemNode.averageScore = subProblemMetrics.averageScore;

        Object.values(subProblemNode.children).forEach(categoryNode => {
          const categoryMetrics = calculateMetrics(categoryNode.items);
          categoryNode.completionRate = categoryMetrics.completionRate;
          categoryNode.averageScore = categoryMetrics.averageScore;
        });
      });
    });
  });

  console.log('Built hierarchy:', hierarchy);
  return hierarchy;
};