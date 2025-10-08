import Constants from "expo-constants";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { useProfileStore } from "@/hooks/workerStores";

export default function Profile() {
  const { fetchProfile, loading, error, profile } = useProfileStore();
  const { height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
      {profile && (
        <View className="m-4 flex-1 gap-2">
          <View className="w-full rounded-md bg-neutral-700 p-4">
            <Text className="text-center italic text-white">
              Editing information for this profile is disabled. Please contact SwipeJobs if need to
              be altered.
            </Text>
          </View>
          <View className="flex-1">
            <Text>First Name:</Text>
            <TextInput
              className="w-full rounded-md border-2 bg-neutral-300 p-1"
              editable={false}
              value={profile.firstName}
            />
          </View>
          <View className="flex-1">
            <Text>Last Name:</Text>
            <TextInput
              className="w-full rounded-md border-2 bg-neutral-300 p-1"
              editable={false}
              value={profile.lastName}
            />
          </View>
          <View className="flex-1">
            <Text>Phone number:</Text>
            <TextInput
              className="w-full rounded-md border-2 bg-neutral-300 p-1"
              editable={false}
              value={profile.phoneNumber}
            />
          </View>
          <View className="flex-1">
            <Text>Email:</Text>
            <TextInput
              className="w-full rounded-md border-2 bg-neutral-300 p-1"
              editable={false}
              value={profile.email}
            />
          </View>
          <View className="flex-1">
            <Text>Address:</Text>
            <TextInput
              className="w-full rounded-md border-2 bg-neutral-300 p-1"
              editable={false}
              value={profile.address.formattedAddress}
            />
          </View>
          <View className="flex-1">
            <Text>Max. job distance (in miles):</Text>
            <TextInput
              className="w-full rounded-md border-2 bg-neutral-300 p-1"
              editable={false}
              value={profile.maxJobDistance.toString()}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
