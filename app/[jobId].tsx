import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform, RefreshControl, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { useShallow } from "zustand/react/shallow";

import JobCard from "@/components/JobCard";
import { JobMatch, useJobActionStore, useJobMatchesStore } from "@/hooks/workerStores";
import { MAXFLATLISTWIDTH } from "@/utils/fixedValues";

type JobDetailsSearchParams = {
  jobId: string;
};

export default function JobDetailsScreen() {
  const { jobId } = useLocalSearchParams<JobDetailsSearchParams>();
  const { acceptJob, rejectJob } = useJobActionStore(
    useShallow((state) => ({ acceptJob: state.acceptJob, rejectJob: state.rejectJob }))
  );
  const getJobDetails = useJobMatchesStore((state) => state.getJobDetails);
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState<JobMatch>();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setDetails(getJobDetails(jobId));
    setRefreshing(false);
  }, [getJobDetails, jobId]);

  useEffect(() => {
    setDetails(getJobDetails(jobId));
  }, [getJobDetails, jobId]);

  const acceptAction = () => acceptJob(jobId);
  const rejectAction = () => rejectJob(jobId);

  return (
    <>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {details && (
          <View className="flex-1 items-center p-4">
            <JobCard
              className="web:m-4 web:w-full"
              style={{
                maxWidth: Platform.OS !== "web" ? MAXFLATLISTWIDTH - 28 : MAXFLATLISTWIDTH - 78,
              }}
              jobInfo={details}
              isDetailed
              acceptAction={acceptAction}
              rejectAction={rejectAction}
            />
          </View>
        )}
      </ScrollView>
      <Toast />
    </>
  );
}
