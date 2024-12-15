import React from 'react';
import { ProjectTask } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaskCardProps {
  task: ProjectTask;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="w-full hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">{task["Action_Required (from Action_ID)"]}</h3>
                <p className="text-sm text-muted-foreground">{task["Item_Name (from Action_ID)"]}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                    {task["Fonction_Name (from Action_ID)"]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-medium">{task["Problems_Name (from Action_ID)"]}</p>
            <p className="text-sm">{task["Sub_Problems_Text (from Action_ID)"]}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
