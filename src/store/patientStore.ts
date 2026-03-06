import { create } from 'zustand';
import { Patient, TriageCategory, EmergencySigns, TEWSInput, Override } from '@/types';

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'arrivalTimestamp' | 'isPediatric' | 'triageStatus' | 'aiAlerts' | 'overrideHistory' | 'registrationCompletedAt'>) => Patient;
  ensurePatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  getPatient: (id: string) => Patient | undefined;
  setTriageStatus: (id: string, status: Patient['triageStatus']) => void;
  setEmergencySigns: (id: string, signs: EmergencySigns) => void;
  setTEWSInput: (id: string, input: TEWSInput) => void;
  assignCategory: (id: string, category: TriageCategory, tewsScore?: number) => void;
  addOverride: (id: string, override: Override) => void;
  getPatientsByStatus: (status: Patient['triageStatus']) => Patient[];
  getPatientsByCategory: (category: TriageCategory) => Patient[];
  findByNationalId: (nationalId: string) => Patient | undefined;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],

  addPatient: (patientData) => {
    const patient: Patient = {
      ...patientData,
      id: `PT${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      arrivalTimestamp: new Date(),
      isPediatric: patientData.age < 15,
      triageStatus: 'WAITING',
      aiAlerts: [],
      overrideHistory: [],
      registrationCompletedAt: new Date(),
    };
    set((state) => ({ patients: [...state.patients, patient] }));
    return patient;
  },

  ensurePatient: (patient) => {
    const exists = get().patients.some((p) => p.id === patient.id);
    if (!exists) {
      set((state) => ({ patients: [...state.patients, patient] }));
    }
  },

  updatePatient: (id, updates) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },

  getPatient: (id) => {
    return get().patients.find((p) => p.id === id);
  },

  setTriageStatus: (id, status) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, triageStatus: status } : p
      ),
    }));
  },

  setEmergencySigns: (id, signs) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, emergencySigns: signs } : p
      ),
    }));
  },

  setTEWSInput: (id, input) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, tewsInput: input } : p
      ),
    }));
  },

  assignCategory: (id, category, tewsScore) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id
          ? {
              ...p,
              category,
              tewsScore,
              categoryAssignedAt: new Date(),
              triageStatus: 'TRIAGED',
            }
          : p
      ),
    }));
  },

  addOverride: (id, override) => {
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id
          ? {
              ...p,
              overrideHistory: [...p.overrideHistory, override],
              category: override.newCategory,
            }
          : p
      ),
    }));
  },

  getPatientsByStatus: (status) => {
    return get().patients.filter((p) => p.triageStatus === status);
  },

  getPatientsByCategory: (category) => {
    return get().patients.filter((p) => p.category === category);
  },

  findByNationalId: (nationalId) => {
    if (!nationalId) return undefined;
    return get().patients.find(
      (p) => p.nationalId && p.nationalId.toLowerCase() === nationalId.toLowerCase()
    );
  },
}));
