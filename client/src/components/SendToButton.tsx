import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Send, ArrowRight, MessageSquare, Zap, Brain, FileText, Settings } from "lucide-react";
import { useTextTransfer, TransferTarget } from "@/contexts/TextTransferContext";

interface SendToButtonProps {
  text: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  excludeTargets?: TransferTarget[];
}

export const SendToButton: React.FC<SendToButtonProps> = ({ 
  text, 
  variant = "outline", 
  size = "sm",
  className = "",
  excludeTargets = []
}) => {
  const { transferText, getAvailableTargets } = useTextTransfer();

  const targetInfo: Record<TransferTarget, { label: string; icon: React.ComponentType<any>; category: string }> = {
    'humanizer-box-a': { label: 'Humanizer Box A (AI Text)', icon: Zap, category: 'humanizer' },
    'humanizer-box-b': { label: 'Humanizer Box B (Style Sample)', icon: Zap, category: 'humanizer' },
    'humanizer-custom-instructions': { label: 'Humanizer Instructions', icon: Settings, category: 'humanizer' },
    'intelligence-analysis': { label: 'Intelligence Analysis', icon: Brain, category: 'analysis' },
    'ai-chat': { label: 'AI Chat', icon: MessageSquare, category: 'chat' },
    'cognitive-evaluation': { label: 'Cognitive Evaluation', icon: Brain, category: 'analysis' }
  };

  const availableTargets = getAvailableTargets().filter(target => !excludeTargets.includes(target));

  // Group targets by category
  const groupedTargets = availableTargets.reduce((acc, target) => {
    const category = targetInfo[target].category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(target);
    return acc;
  }, {} as Record<string, TransferTarget[]>);

  if (availableTargets.length === 0) {
    return null;
  }

  if (availableTargets.length === 1) {
    const target = availableTargets[0];
    const info = targetInfo[target];
    const IconComponent = info.icon;
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => transferText(text, target)}
        className={`gap-2 ${className}`}
      >
        <IconComponent className="h-4 w-4" />
        Send to {info.label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={`gap-2 ${className}`}>
          <Send className="h-4 w-4" />
          Send To
          <ArrowRight className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(groupedTargets).map(([category, targets], categoryIndex) => (
          <React.Fragment key={category}>
            {categoryIndex > 0 && <DropdownMenuSeparator />}
            {targets.map((target) => {
              const info = targetInfo[target];
              const IconComponent = info.icon;
              return (
                <DropdownMenuItem
                  key={target}
                  onClick={() => transferText(text, target)}
                  className="cursor-pointer"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {info.label}
                </DropdownMenuItem>
              );
            })}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SendToButton;