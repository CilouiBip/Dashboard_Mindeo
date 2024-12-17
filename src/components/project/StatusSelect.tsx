import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ActionStatus } from '../../types/projectBeta';

interface StatusSelectProps {
  actionId: string;
  currentStatus?: string;
  onStatusChange: (id: string, status: string) => void;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  actionId,
  currentStatus = ActionStatus.NOT_STARTED,
  onStatusChange,
}) => {
  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={(value) => onStatusChange(actionId, value)}
    >
      <SelectTrigger className="w-[140px] bg-[#1A1B1E] border-[#2D2E3A]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ActionStatus.NOT_STARTED}>Non Démarré</SelectItem>
        <SelectItem value={ActionStatus.IN_PROGRESS}>En Cours</SelectItem>
        <SelectItem value={ActionStatus.COMPLETED}>Terminé</SelectItem>
      </SelectContent>
    </Select>
  );
};