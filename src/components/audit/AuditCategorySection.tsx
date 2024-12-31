import React from 'react';
import { HierarchyNode } from '../../types/audit';
import AuditItemRow from './AuditItemRow';

interface AuditCategorySectionProps {
  categoryName: string;
  categoryData: HierarchyNode;
}

const AuditCategorySection: React.FC<AuditCategorySectionProps> = ({
  categoryName,
  categoryData
}) => {
  return (
    <div className="bg-[#222329] rounded-lg overflow-hidden">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <h5 className="text-gray-300 text-sm">{categoryName}</h5>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-violet-400">
              {categoryData.completionRate.toFixed(0)}% Complete
            </span>
            {categoryData.averageScore > 0 && (
              <span className="text-sm text-blue-400">
                Avg Score: {categoryData.averageScore.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 pb-2 space-y-2">
        {categoryData.items.map((item) => (
          <AuditItemRow key={item.Item_ID} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AuditCategorySection;