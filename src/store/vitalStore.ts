import { create } from 'zustand';
import { VitalSigns, VitalReading } from '@/types';

interface VitalState {
  vitalsByPatient: Map<string, VitalSigns>;
  vitalHistory: Map<string, Map<string, VitalReading[]>>; // patientId -> vitalType -> readings
  updateVitals: (patientId: string, vitals: VitalSigns) => void;
  getVitals: (patientId: string) => VitalSigns | undefined;
  getVitalHistory: (patientId: string, vitalType: string) => VitalReading[];
  addVitalReading: (patientId: string, vitalType: string, reading: VitalReading) => void;
  clearVitals: (patientId: string) => void;
}

export const useVitalStore = create<VitalState>((set, get) => ({
  vitalsByPatient: new Map(),
  vitalHistory: new Map(),

  updateVitals: (patientId, vitals) => {
    const { vitalsByPatient, vitalHistory } = get();
    const newVitalsByPatient = new Map(vitalsByPatient);
    newVitalsByPatient.set(patientId, vitals);

    // Update history for each vital
    const newVitalHistory = new Map(vitalHistory);
    if (!newVitalHistory.has(patientId)) {
      newVitalHistory.set(patientId, new Map());
    }
    const patientHistory = newVitalHistory.get(patientId)!;

    const vitalTypes = [
      { type: 'heartRate', value: vitals.heartRate },
      { type: 'respiratoryRate', value: vitals.respiratoryRate },
      { type: 'spo2', value: vitals.spo2 },
      { type: 'systolicBP', value: vitals.systolicBP },
      { type: 'temperature', value: vitals.temperature },
      { type: 'ecg', value: vitals.ecg },
      { type: 'glucose', value: vitals.glucose },
    ];

    vitalTypes?.forEach(({ type, value }) => {
      const readings = patientHistory.get(type) || [];
      const newReadings = [
        ...readings,
        { timestamp: vitals.timestamp, value },
      ].slice(-10); // Keep last 10 readings
      patientHistory.set(type, newReadings);
    });

    set({
      vitalsByPatient: newVitalsByPatient,
      vitalHistory: newVitalHistory,
    });
  },

  getVitals: (patientId) => {
    return get().vitalsByPatient.get(patientId);
  },

  getVitalHistory: (patientId, vitalType) => {
    const patientHistory = get().vitalHistory.get(patientId);
    if (!patientHistory) return [];
    return patientHistory.get(vitalType) || [];
  },

  addVitalReading: (patientId, vitalType, reading) => {
    const { vitalHistory } = get();
    const newVitalHistory = new Map(vitalHistory);
    
    if (!newVitalHistory.has(patientId)) {
      newVitalHistory.set(patientId, new Map());
    }
    const patientHistory = newVitalHistory.get(patientId)!;
    
    const readings = patientHistory.get(vitalType) || [];
    const newReadings = [...readings, reading].slice(-10);
    patientHistory.set(vitalType, newReadings);

    set({ vitalHistory: newVitalHistory });
  },

  clearVitals: (patientId) => {
    const { vitalsByPatient, vitalHistory } = get();
    const newVitalsByPatient = new Map(vitalsByPatient);
    const newVitalHistory = new Map(vitalHistory);
    
    newVitalsByPatient.delete(patientId);
    newVitalHistory.delete(patientId);

    set({
      vitalsByPatient: newVitalsByPatient,
      vitalHistory: newVitalHistory,
    });
  },
}));
