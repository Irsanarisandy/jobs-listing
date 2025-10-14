import { useEffect } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/react/shallow";

import JobMatchList from "@/components/JobMatchList";
import { useJobMatchesStore, useProfileStore } from "@/hooks/workerStores";

export default function Index() {
  const { fetchJobs, loading, error, jobMatches } = useJobMatchesStore(
    useShallow((state) => ({
      fetchJobs: state.fetchJobs,
      loading: state.loading,
      error: state.error,
      jobMatches: state.jobMatches,
    }))
  );
  const { fetchProfile, profile } = useProfileStore(
    useShallow((state) => ({ fetchProfile: state.fetchProfile, profile: state.profile }))
  );

  useEffect(() => {
    if (!jobMatches) fetchJobs();
    if (!profile) fetchProfile();
  }, []);

  return (
    <View className="flex-1 items-center">
      <JobMatchList
        data={jobMatches || []}
        loading={loading}
        error={error}
        refreshAction={fetchJobs}
      />
    </View>
  );
}
