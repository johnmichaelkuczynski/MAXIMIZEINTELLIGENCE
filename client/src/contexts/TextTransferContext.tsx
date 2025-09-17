import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export type TransferTarget = 
  | 'humanizer-box-a' 
  | 'humanizer-box-b' 
  | 'humanizer-custom-instructions'
  | 'intelligence-analysis'
  | 'ai-chat'
  | 'cognitive-evaluation';

interface TextTransferContextType {
  // Register a receiver for a specific target
  registerReceiver: (target: TransferTarget, receiver: (text: string) => void) => void;
  // Remove a receiver
  unregisterReceiver: (target: TransferTarget) => void;
  // Transfer text to a specific target
  transferText: (text: string, target: TransferTarget) => void;
  // Get available targets (targets that have registered receivers)
  getAvailableTargets: () => TransferTarget[];
}

const TextTransferContext = createContext<TextTransferContextType | undefined>(undefined);

export const useTextTransfer = () => {
  const context = useContext(TextTransferContext);
  if (!context) {
    throw new Error('useTextTransfer must be used within a TextTransferProvider');
  }
  return context;
};

export const TextTransferProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [receivers, setReceivers] = useState<Map<TransferTarget, (text: string) => void>>(new Map());
  const { toast } = useToast();

  const registerReceiver = useCallback((target: TransferTarget, receiver: (text: string) => void) => {
    setReceivers(prev => new Map(prev).set(target, receiver));
  }, []);

  const unregisterReceiver = useCallback((target: TransferTarget) => {
    setReceivers(prev => {
      const newMap = new Map(prev);
      newMap.delete(target);
      return newMap;
    });
  }, []);

  const transferText = useCallback((text: string, target: TransferTarget) => {
    const receiver = receivers.get(target);
    if (receiver) {
      receiver(text);
      
      // Show success toast
      const targetNames: Record<TransferTarget, string> = {
        'humanizer-box-a': 'Humanizer Box A',
        'humanizer-box-b': 'Humanizer Box B',
        'humanizer-custom-instructions': 'Humanizer Custom Instructions',
        'intelligence-analysis': 'Intelligence Analysis',
        'ai-chat': 'AI Chat',
        'cognitive-evaluation': 'Cognitive Evaluation'
      };
      
      toast({
        title: `Text sent to ${targetNames[target]}`,
        description: `Successfully transferred ${text.length} characters`,
      });
    } else {
      toast({
        title: "Transfer failed",
        description: `No receiver registered for ${target}`,
        variant: "destructive"
      });
    }
  }, [receivers, toast]);

  const getAvailableTargets = useCallback(() => {
    return Array.from(receivers.keys());
  }, [receivers]);

  return (
    <TextTransferContext.Provider value={{
      registerReceiver,
      unregisterReceiver,
      transferText,
      getAvailableTargets
    }}>
      {children}
    </TextTransferContext.Provider>
  );
};