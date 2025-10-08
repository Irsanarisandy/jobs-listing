import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";

import { useProfileStore } from "@/hooks/workerStores";
import "../global.css";

export default function RootLayout() {
  const { profile } = useProfileStore();

  const headerTitle = () => (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "/",
        })
      }
    >
      <Text className="text-2xl text-white">SwipeJobs</Text>
    </Pressable>
  );

  const headerRight = () => {
    if (!profile) return;

    return (
      <Pressable
        onPress={() =>
          router.navigate({
            pathname: "/profile",
          })
        }
      >
        <Text className="text-lg text-white web:mr-4">{`${profile.firstName} ${profile.lastName}`}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <StatusBar translucent={false} style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "black" },
          headerBackVisible: false,
          headerLeft: () => undefined,
          headerTitle,
          headerRight,
        }}
      />
    </>
  );
}
