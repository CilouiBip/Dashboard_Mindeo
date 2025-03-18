# Rapport d'Audit des Exports UI
\nDate: Wed Jan  8 09:00:29 +01 2025\n
## 1. Analyse des Composants UI\n
### Button.tsx\n
```typescript
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
```\n
### Slider.tsx\n
```typescript
export { Slider }
```\n
### badge.tsx\n
```typescript
export interface BadgeProps {
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
```\n
### card.tsx\n
```typescript
export const Card = React.forwardRef<
export const CardHeader = React.forwardRef<
export const CardTitle = React.forwardRef<
export const CardDescription = React.forwardRef<
export const CardContent = React.forwardRef<
export const CardFooter = React.forwardRef<
```\n
### completion-bar.tsx\n
```typescript
export const CompletionBar: React.FC<CompletionBarProps> = ({ percentage, className = '' }) => {
```\n
### completion-circle.tsx\n
```typescript
export default CompletionCircle;
```\n
### input.tsx\n
```typescript
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
```\n
### progress.tsx\n
```typescript
export default Progress;
```\n
### score-display.tsx\n
```typescript
export default ScoreDisplay;
```\n
### select.tsx\n
```typescript
export {
```\n
### star-rating.tsx\n
```typescript
export interface StarRatingProps {
export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
```\n
### tabs.tsx\n
```typescript
export { Tabs, TabsList, TabsTrigger, TabsContent }
```\n
### text.tsx\n
```typescript
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
```\n
### title.tsx\n
```typescript
export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
```\n
### tooltip.tsx\n
```typescript
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = React.forwardRef<
```\n
## 2. Vérification des Imports dans index.ts\n
```typescript
export { Button } from './Button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Input } from './input';
export { Text } from './text';
export { Title } from './title';
export { Badge } from './badge';
export { CompletionBar } from './completion-bar';
export { CompletionCircle } from './completion-circle';
export { Progress } from './progress';
export { ScoreDisplay } from './score-display';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { StarRating } from './star-rating';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export { PlusOutlined } from '@ant-design/icons';
```\n
## 3. Recherche des Imports dans le Codebase\n
### Imports trouvés :\n
```typescript
src//components/project/TaskCard.tsx:import { Card, CardContent } from '@/components/ui/card';
src//components/project/TaskCard.tsx:import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
src//pages/RoadmapPage.tsx:import { Title, Text, Input, Button, PlusOutlined } from '../components/ui';
src//pages/ActionsList.tsx:import { Card } from '../components/ui/card';
src//pages/ImpactSimulator.tsx:import { Card } from '../components/ui/Card';
src//pages/ImpactSimulator.tsx:import { Select } from '../components/ui/Select';
src//pages/ImpactSimulator.tsx:import { Tooltip as UITooltip } from '../components/ui/Tooltip';
src//pages/ProjectPlan.tsx:import { Card } from '../components/ui/card';
src//pages/ProjectPlan.tsx:import { Select } from '../components/ui/select';
src//pages/ProjectPlan.tsx:import { Input } from '../components/ui/input';
src//pages/ProjectPlan.tsx:import { Button } from '../components/ui/Button';
src//pages/ProjectPlanPage.tsx:import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
src//pages/ProjectPlanPage.tsx:import { Card } from '../components/ui/card';
src//pages/ProjectPlanBeta.tsx:import { Card } from '../components/ui/card';
```\n
