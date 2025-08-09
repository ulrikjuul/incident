import { create } from 'zustand';
import type { DivingIncident } from '../types/incident';

interface IncidentStore {
  incidents: DivingIncident[];
  currentIncident: DivingIncident | null;
  isLoading: boolean;
  error: string | null;
  
  addIncident: (incident: DivingIncident) => Promise<void>;
  updateIncident: (id: string, incident: Partial<DivingIncident>) => Promise<void>;
  deleteIncident: (id: string) => Promise<void>;
  setCurrentIncident: (incident: DivingIncident | null) => void;
  loadIncidents: () => Promise<void>;
  saveToFile: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: {
      saveIncidents: (incidents: DivingIncident[]) => Promise<{ success: boolean; error?: string }>;
      loadIncidents: () => Promise<{ success: boolean; data?: DivingIncident[]; error?: string }>;
    };
  }
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: [],
  currentIncident: null,
  isLoading: false,
  error: null,

  addIncident: async (incident) => {
    set((state) => ({
      incidents: [...state.incidents, incident],
      error: null
    }));
    
    // Save to file if in Electron
    if (window.electronAPI) {
      await get().saveToFile();
    } else {
      // Save to localStorage for web version
      localStorage.setItem('incidents', JSON.stringify(get().incidents));
    }
  },

  updateIncident: async (id, updatedData) => {
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, ...updatedData, updatedAt: new Date().toISOString() } : inc
      ),
      error: null
    }));
    
    if (window.electronAPI) {
      await get().saveToFile();
    } else {
      localStorage.setItem('incidents', JSON.stringify(get().incidents));
    }
  },

  deleteIncident: async (id) => {
    set((state) => ({
      incidents: state.incidents.filter((inc) => inc.id !== id),
      currentIncident: state.currentIncident?.id === id ? null : state.currentIncident,
      error: null
    }));
    
    if (window.electronAPI) {
      await get().saveToFile();
    } else {
      localStorage.setItem('incidents', JSON.stringify(get().incidents));
    }
  },

  setCurrentIncident: (incident) => {
    set({ currentIncident: incident });
  },

  loadIncidents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.loadIncidents();
        if (result.success && result.data) {
          set({ incidents: result.data, isLoading: false });
        } else {
          set({ error: result.error || 'Failed to load incidents', isLoading: false });
        }
      } else {
        // Load from localStorage for web version
        const stored = localStorage.getItem('incidents');
        if (stored) {
          set({ incidents: JSON.parse(stored), isLoading: false });
        } else {
          set({ incidents: [], isLoading: false });
        }
      }
    } catch (error) {
      set({ error: 'Failed to load incidents', isLoading: false });
    }
  },

  saveToFile: async () => {
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.saveIncidents(get().incidents);
        if (!result.success) {
          set({ error: result.error || 'Failed to save incidents' });
        }
      } catch (error) {
        set({ error: 'Failed to save incidents' });
      }
    }
  }
}));