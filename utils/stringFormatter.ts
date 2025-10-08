import { ShiftDate } from "@/hooks/workerStores";

// assume phone number is in USA format
export const formatPhoneNumber = (phoneNumber: string) => {
  const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

// assume timeZone is in Los Angeles, America
export const formatShiftDate = (shiftDate: ShiftDate) => {
  const startDay = new Date(shiftDate.startDate).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const endDay = new Date(shiftDate.endDate).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const startTime = new Date(shiftDate.startDate).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    timeStyle: "short",
  });
  const endTime = new Date(shiftDate.endDate).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    timeStyle: "short",
  });
  if (startDay === endDay) {
    return `${startDay.toUpperCase()} @ ${startTime} - ${endTime} PDT`;
  }
  return `${startDay.toUpperCase()} ${startTime} - ${endDay.toUpperCase()} ${endTime} PDT`;
};
