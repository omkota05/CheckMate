import { create } from 'zustand';
import { Receipt, AgentMessage, mockReceipt, healingMap } from './mockData';

interface AppState {
  currentReceipt: Receipt | null;
  agentMessages: AgentMessage[];
  activeTab: 'home' | 'receipt' | 'settle';
  setActiveTab: (tab: 'home' | 'receipt' | 'settle') => void;
  setCurrentReceipt: (receipt: Receipt | null) => void;
  addAgentMessage: (msg: Omit<AgentMessage, 'id' | 'timestamp'>) => void;
  startHealingSimulation: () => void;
  assignItem: (itemId: string, assignees: string[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentReceipt: null,
  agentMessages: [
    {
      id: 'init',
      timestamp: new Date(),
      message: 'Awaiting Receipt...',
      type: 'idle',
    },
  ],
  activeTab: 'home',

  setActiveTab: (tab) => set({ activeTab: tab }),

  setCurrentReceipt: (receipt) => set({ currentReceipt: receipt }),

  addAgentMessage: (msg) =>
    set((state) => ({
      agentMessages: [
        { ...msg, id: crypto.randomUUID(), timestamp: new Date() },
        ...state.agentMessages,
      ],
    })),

  assignItem: (itemId, assignees) =>
    set((state) => {
      if (!state.currentReceipt) return state;
      return {
        currentReceipt: {
          ...state.currentReceipt,
          items: state.currentReceipt.items.map((item) =>
            item.id === itemId ? { ...item, assigned_to: assignees } : item
          ),
        },
      };
    }),

  startHealingSimulation: () => {
    const receipt = { ...mockReceipt };
    set({
      currentReceipt: receipt,
      agentMessages: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          message: 'Agent Parsing Image...',
          type: 'processing',
        },
      ],
    });

    const items = receipt.items;
    let delay = 1500;

    items.forEach((item, index) => {
      // Searching message
      setTimeout(() => {
        const { addAgentMessage } = get();
        addAgentMessage({
          message: `Searching Menu: '${item.original_ocr_name}' (Confidence: ${item.confidence_score.toFixed(1)})...`,
          type: 'searching',
        });
      }, delay);
      delay += 1800;

      // Healed message
      setTimeout(() => {
        const healedName = healingMap[item.original_ocr_name] || item.original_ocr_name;
        const { addAgentMessage } = get();
        addAgentMessage({
          message: `Data Healed! (${item.original_ocr_name} → ${healedName})`,
          type: 'healed',
        });

        set((state) => {
          if (!state.currentReceipt) return state;
          const updatedItems = state.currentReceipt.items.map((i) =>
            i.id === item.id
              ? { ...i, healed_name: healedName, confidence_score: 0.98, status: 'verified' as const }
              : i
          );
          return {
            currentReceipt: {
              ...state.currentReceipt,
              items: updatedItems,
              status: index === items.length - 1 ? 'healed' : state.currentReceipt.status,
            },
          };
        });
      }, delay);
      delay += 1200;
    });

    // Final message
    setTimeout(() => {
      const { addAgentMessage } = get();
      addAgentMessage({
        message: 'All items verified. Ready for assignment.',
        type: 'healed',
      });
    }, delay);
  },
}));
