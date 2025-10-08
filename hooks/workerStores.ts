import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { create } from "zustand";

import { DEFAULTWORKERID } from "@/utils/fixedValues";

export interface ShiftDate {
  startDate: string;
  endDate: string;
}

export interface JobMatch {
  jobId: string;
  jobTitle: {
    name: string;
    imageUrl: string;
  };
  company: {
    name: string;
    address: {
      formattedAddress: string;
      zoneId: string;
    };
    reportTo: {
      name: string;
      phone?: string;
    };
  };
  wagePerHourInCents: number;
  milesToTravel: number;
  shifts: ShiftDate[];
  branch: string;
  branchPhoneNumber: string;
  requirements?: string[];
}

interface JobMatchStore {
  jobMatches: JobMatch[] | undefined;
  loading: boolean;
  error: AxiosError | undefined;
  fetchJobs: (workerId?: string) => Promise<void>;
  getJobDetails: (jobId: string) => JobMatch | undefined;
  reset: () => void; // only exist for used within testing
}

export interface JobActionResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
}

interface JobActionStore extends JobActionResponse {
  acceptJob: (jobId: string, workerId?: string) => Promise<void>;
  rejectJob: (jobId: string, workerId?: string) => Promise<void>;
  reset: () => void; // only exist for used within testing
}

export interface Profile {
  address: {
    formattedAddress: string;
    zoneId: string;
  };
  email: string;
  firstName: string;
  lastName: string;
  maxJobDistance: number;
  phoneNumber: string;
  workerId: string;
}

interface ProfileStore {
  profile: Profile | undefined;
  loading: boolean;
  error: AxiosError | undefined;
  fetchProfile: (workerId?: string) => Promise<void>;
  reset: () => void; // only exist for used within testing
}

export const worker = axios.create({
  baseURL: "https://test.swipejobs.com/api/worker",
});

export const useJobMatchesStore = create<JobMatchStore>((set, get, store) => ({
  jobMatches: undefined,
  loading: false,
  error: undefined,
  // real life will not have default worker id
  fetchJobs: async (workerId = DEFAULTWORKERID) => {
    set({ jobMatches: undefined, loading: true, error: undefined });
    await worker
      .get<JobMatch[]>(`/${workerId}/matches`)
      .then((response) => {
        set({ jobMatches: response.data, loading: false });
      })
      .catch((error: AxiosError) => {
        set({ error, loading: false });
      });
  },
  getJobDetails: (jobId: string) => get().jobMatches?.find((match) => match.jobId === jobId),
  reset: () => set(store.getInitialState()), // only exist for used within testing
}));

export const useJobActionStore = create<JobActionStore>((set, _, store) => ({
  success: true,
  message: undefined,
  errorCode: undefined,
  // real life will not have default worker id
  acceptJob: async (jobId: string, workerId = DEFAULTWORKERID) => {
    set({ success: true, message: undefined, errorCode: undefined });
    await worker
      .get<JobActionResponse>(`/${workerId}/job/${jobId}/accept`)
      .then((response) => {
        const { success, message, errorCode } = response.data;
        if (!success) {
          set({ success, message, errorCode });
        }
        const toastMessage = "You have successfully accepted this job!";
        Toast.show({
          type: success ? "success" : "error",
          text1: success ? toastMessage : message,
        });
      })
      .catch((error: AxiosError) => {
        set({
          success: false,
          message: error.message,
          errorCode: error.status != null ? `HTTP-${error.status}` : undefined,
        });
        Toast.show({
          type: "error",
          text1: error.message,
        });
      });
  },
  // real life will not have default worker id
  rejectJob: async (jobId: string, workerId = DEFAULTWORKERID) => {
    set({ success: true, message: undefined, errorCode: undefined });
    await worker
      .get<JobActionResponse>(`/${workerId}/job/${jobId}/reject`)
      .then((response) => {
        const { success, message, errorCode } = response.data;
        if (!success) {
          set({ success, message, errorCode });
        }
        const toastMessage = "You have successfully rejected this job!";
        Toast.show({
          type: success ? "success" : "error",
          text1: success ? toastMessage : message,
        });
      })
      .catch((error: AxiosError) => {
        set({
          success: false,
          message: error.message,
          errorCode: error.status != null ? `HTTP-${error.status}` : undefined,
        });
        Toast.show({
          type: "error",
          text1: error.message,
        });
      });
  },
  reset: () => set(store.getInitialState()), // only exist for used within testing
}));

export const useProfileStore = create<ProfileStore>((set, _, store) => ({
  profile: undefined,
  loading: false,
  error: undefined,
  // real life will not have default worker id
  fetchProfile: async (workerId = DEFAULTWORKERID) => {
    set({ profile: undefined, loading: true, error: undefined });
    await worker
      .get<Profile>(`/${workerId}/profile`)
      .then((response) => {
        set({ profile: response.data, loading: false });
      })
      .catch((error: AxiosError) => {
        set({ error, loading: false });
      });
  },
  reset: () => set(store.getInitialState()), // only exist for used within testing
}));
