import { create } from 'zustand';
import { AIAlert, TriageCategory } from '@/types';

interface AlertState {
  alerts: AIAlert[];
  addAlert: (alert: Omit<AIAlert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (id: string, clinicianId: string, comment?: string) => void;
  applyRecommendation: (alertId: string, clinicianId: string, clinicianName: string) => { patientId: string; previousCategory?: TriageCategory; newCategory?: TriageCategory } | null;
  dismissAlert: (id: string, clinicianId: string, reason: string) => void;
  getActiveAlerts: () => AIAlert[];
  getPatientAlerts: (patientId: string) => AIAlert[];
  getCriticalAlerts: () => AIAlert[];
  getAlertsByType: (type: AIAlert['type']) => AIAlert[];
  clearPatientAlerts: (patientId: string) => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],

  addAlert: (alertData) => {
    const alert: AIAlert = {
      ...alertData,
      id: `AL${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date(),
      acknowledged: false,
    };
    set((state) => ({ alerts: [...state.alerts, alert] }));
  },

  acknowledgeAlert: (id, clinicianId, comment) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              acknowledged: true,
              acknowledgedBy: clinicianId,
              acknowledgedAt: new Date(),
              comment,
            }
          : alert
      ),
    }));
  },

  /**
   * Apply the AI-recommended category change from an alert.
   * Returns the patientId and category info for audit logging.
   */
  applyRecommendation: (alertId, clinicianId, clinicianName) => {
    const alert = get().alerts.find(a => a.id === alertId);
    if (!alert || alert.acknowledged || !alert.recommendedCategory) return null;

    // Mark alert as acknowledged with action taken
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: clinicianName,
              acknowledgedAt: new Date(),
              comment: `AI recommendation applied — category changed to ${alert.recommendedCategory}`,
            }
          : a
      ),
    }));

    return {
      patientId: alert.patientId,
      previousCategory: alert.previousCategory,
      newCategory: alert.recommendedCategory,
    };
  },

  /**
   * Dismiss an alert with a reason (clinician overrides AI recommendation)
   */
  dismissAlert: (id, clinicianId, reason) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              acknowledged: true,
              acknowledgedBy: clinicianId,
              acknowledgedAt: new Date(),
              comment: `Dismissed: ${reason}`,
            }
          : alert
      ),
    }));
  },

  getActiveAlerts: () => {
    return get().alerts.filter((alert) => !alert.acknowledged);
  },

  getPatientAlerts: (patientId) => {
    return get().alerts.filter((alert) => alert.patientId === patientId);
  },

  getCriticalAlerts: () => {
    return get().alerts.filter(
      (alert) => !alert.acknowledged && alert.severity === 'CRITICAL'
    );
  },

  getAlertsByType: (type) => {
    return get().alerts.filter((alert) => alert.type === type);
  },

  clearPatientAlerts: (patientId) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.patientId !== patientId),
    }));
  },
}));
