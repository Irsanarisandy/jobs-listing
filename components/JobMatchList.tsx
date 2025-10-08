import { AxiosError } from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { JobMatch } from "@/hooks/workerStores";
import { MAXFLATLISTWIDTH } from "@/utils/fixedValues";
import JobCard from "./JobCard";

interface JobMatchListProps {
  data: JobMatch[];
  loading: boolean;
  error?: AxiosError;
  refreshAction?: () => void;
}

const JobMatchList = ({ data, loading, error, refreshAction }: JobMatchListProps) => {
  const { height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    if (!!refreshAction) {
      setRefreshing(true);
      refreshAction();
      setRefreshing(false);
    }
  }, [refreshAction]);

  const Divider = () => <View className="my-2" />;

  const RenderItem = ({ item }: ListRenderItemInfo<JobMatch>) => (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/[jobId]",
          params: { jobId: item.jobId },
        })
      }
    >
      <JobCard jobInfo={item} />
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <>
      {loading && <ActivityIndicator accessibilityHint="loading" size="large" />}
      {!!error && (
        <View
          className="flex-1 items-center justify-center p-4"
          style={{ height: height - Constants.statusBarHeight }}
        >
          <Text>
            {error.message}. Please try refreshing, otherwise contact SwipeJobs for support.
          </Text>
        </View>
      )}
    </>
  );

  return (
    <FlatList<JobMatch>
      keyExtractor={(item) => item.jobId}
      className="w-full p-4"
      style={{ maxWidth: MAXFLATLISTWIDTH }}
      contentContainerClassName="pb-8"
      data={data}
      renderItem={RenderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ItemSeparatorComponent={Divider}
      ListEmptyComponent={ListEmptyComponent}
      testID="jobMatchList"
    />
  );
};

export default JobMatchList;
