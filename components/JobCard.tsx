import { Entypo, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image, StyleProp, Text, View, ViewStyle } from "react-native";

import { JobMatch } from "@/hooks/workerStores";
import { formatPhoneNumber, formatShiftDate } from "@/utils/stringFormatter";
import Button from "./Button";

interface JobCardProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  jobInfo: JobMatch;
  isDetailed?: boolean;
  acceptAction?: () => void;
  rejectAction?: () => void;
}

const Divider = () => <View className="my-4 bg-neutral-100" style={{ height: 4 }} />;

const JobCard = ({
  className,
  style,
  jobInfo,
  isDetailed,
  acceptAction,
  rejectAction,
}: JobCardProps) => {
  const iconSize = 30;

  return (
    <View className={`flex-1 rounded-xl bg-white ${className}`} style={style}>
      <Image
        accessibilityHint="job image"
        className="rounded-t-xl"
        source={{ uri: jobInfo.jobTitle.imageUrl }}
        style={{
          aspectRatio: 37 / 12,
          resizeMode: "contain",
          height: "auto",
          width: "100%",
        }}
      />
      <View className="flex-1 p-4 web:flex-none">
        <Text className="text-2xl font-bold" numberOfLines={2}>
          {jobInfo.jobTitle.name}
        </Text>
        <Text className="text-lg font-bold" numberOfLines={2}>
          {jobInfo.company.name}
        </Text>
      </View>
      <View className="flex-1 flex-row bg-teal-400 p-4 web:flex-none">
        <View className="flex-1">
          <Text className="text-sm font-bold">Distance</Text>
          <Text className="text-3xl font-bold text-white">
            {jobInfo.milesToTravel.toFixed(1)} miles
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-sm font-bold">Hourly Rate</Text>
          <View className="flex-1 flex-row">
            <Text className="text-sm text-white">$</Text>
            <Text className="text-3xl font-bold text-white">
              {(jobInfo.wagePerHourInCents / 100).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-1 p-4">
        {isDetailed && (
          <>
            <View className="flex-1 flex-row items-start web:flex-none">
              <FontAwesome6 className="mt-4" name="calendar-days" size={iconSize} />
              <View className="ml-4 flex-1">
                <Text className="font-bold">Shift Dates</Text>
                {jobInfo.shifts.map((shift, index) => (
                  <Text key={`shift-${index}`} className="text-lg web:text-base" numberOfLines={2}>
                    {formatShiftDate(shift)}
                  </Text>
                ))}
              </View>
            </View>
            <Divider />
          </>
        )}
        <View className="flex-1 flex-row items-start web:flex-none">
          <Entypo className="mt-4" name="location-pin" size={iconSize} />
          <View className="ml-4 flex-1">
            <Text className="font-bold">Location</Text>
            <Text className="text-lg web:text-base" numberOfLines={2}>
              {jobInfo.company.address.formattedAddress}
            </Text>
            <Text className="text-sm" numberOfLines={2}>
              {jobInfo.milesToTravel} miles from your job search location
            </Text>
          </View>
        </View>
        {isDetailed && !!jobInfo.requirements && (
          <>
            <Divider />
            <View className="flex-1 flex-row items-start web:flex-none">
              <Entypo className="mt-4" name="tools" size={iconSize} />
              <View className="ml-4 flex-1">
                <Text className="font-bold">Requirements</Text>
                {jobInfo.requirements.map((requirement, index) => (
                  <Text
                    key={`requirement-${index}`}
                    className="text-lg web:text-base"
                    numberOfLines={2}
                  >
                    - {requirement}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
        {isDetailed && (
          <>
            <Divider />
            <View className="flex-1 flex-row items-start web:flex-none">
              <FontAwesome className="mt-4" name="user-circle-o" size={iconSize} />
              <View className="ml-4 flex-1">
                <Text className="font-bold">Report To</Text>
                <View className="flex-1 flex-row">
                  <Text className="text-lg web:text-base" numberOfLines={2}>
                    {jobInfo.company.reportTo.name}
                  </Text>
                  {!!jobInfo.company.reportTo.phone && (
                    <Text className="text-lg web:text-base" numberOfLines={2}>
                      &nbsp;- {formatPhoneNumber(jobInfo.company.reportTo.phone)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {(!!acceptAction || !!rejectAction) && (
              <View className="mt-8 w-full flex-1 flex-row gap-2">
                {!!rejectAction && (
                  <View className="flex-1">
                    <Button text="No Thanks" type="secondary" onPress={rejectAction} />
                  </View>
                )}
                {!!acceptAction && (
                  <View className="flex-1">
                    <Button text="I'll Take It" onPress={acceptAction} />
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default JobCard;
