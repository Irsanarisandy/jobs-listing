import { useEffect } from "react";
import { View } from "react-native";

import JobMatchList from "@/components/JobMatchList";
import { useJobMatchesStore, useProfileStore } from "@/hooks/workerStores";

export default function Index() {
  const { fetchJobs, loading, error, jobMatches } = useJobMatchesStore();
  const { fetchProfile, profile } = useProfileStore();

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
