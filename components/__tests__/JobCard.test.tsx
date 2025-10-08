import { fireEvent, render } from "@testing-library/react-native";

import { JobMatch } from "@/hooks/workerStores";
import JobCard from "../JobCard";

const fakeJobMatch: JobMatch = {
  jobId: "12345",
  jobTitle: {
    name: "Killing jedi",
    imageUrl: "https://picsum.photos/200",
  },
  company: {
    name: "Sith inc.",
    address: {
      formattedAddress: "6834 Hollywood Blvd, Los Angeles, California 90028-6102, US",
      zoneId: "America/Los_Angeles",
    },
    reportTo: {
      name: "Sheev Palpatine",
      phone: "6660690420",
    },
  },
  wagePerHourInCents: 100000,
  milesToTravel: 1000,
  shifts: [
    {
      startDate: "2019-09-04T21:00:00Z",
      endDate: "2019-09-05T05:00:00Z",
    },
  ],
  branch: "Death Star",
  branchPhoneNumber: "6660690420",
};

describe("JobCard component", () => {
  test("renders image and text correctly if isDetailed is false", () => {
    const jobCardComp = render(<JobCard jobInfo={fakeJobMatch} />);
    const { getByAccessibilityHint, getByText, queryByText } = jobCardComp;

    const img = getByAccessibilityHint("job image");
    expect(img.props.source.uri).toBe(fakeJobMatch.jobTitle.imageUrl);
    getByText(fakeJobMatch.jobTitle.name);
    // will assume the rest of the texts have displayed properly

    // test for one of the text to not display due to isDetailed not true
    expect(queryByText("Shift Dates")).toBeNull();
    // will assume others that requires isDetailed to not display

    // buttons should not be displayed
    expect(queryByText("No Thanks")).toBeNull();
    expect(queryByText("I'll Take It")).toBeNull();
  });

  test("renders image and text correctly if isDetailed is true", () => {
    const jobCardComp = render(<JobCard jobInfo={fakeJobMatch} isDetailed />);
    const { getByAccessibilityHint, getByText, queryByText } = jobCardComp;

    const img = getByAccessibilityHint("job image");
    expect(img.props.source.uri).toBe(fakeJobMatch.jobTitle.imageUrl);
    getByText(fakeJobMatch.jobTitle.name);
    // will assume the rest of the texts have displayed properly

    // test for one of the text to display due to isDetailed true
    getByText("Shift Dates");
    // will assume others that requires isDetailed to display

    // buttons should still not be displayed due to functions not pass as props
    expect(queryByText("No Thanks")).toBeNull();
    expect(queryByText("I'll Take It")).toBeNull();
  });

  test("buttons doesn't render if isDetailed is false even though functions passed", () => {
    const jobCardComp = render(
      <JobCard jobInfo={fakeJobMatch} acceptAction={() => {}} rejectAction={() => {}} />
    );
    const { queryByText } = jobCardComp;

    expect(queryByText("No Thanks")).toBeNull();
    expect(queryByText("I'll Take It")).toBeNull();
  });

  test("renders buttons if both isDetailed is true and functions passed", () => {
    const acceptAction = jest.fn();
    const rejectAction = jest.fn();
    const jobCardComp = render(
      <JobCard
        jobInfo={fakeJobMatch}
        isDetailed
        acceptAction={acceptAction}
        rejectAction={rejectAction}
      />
    );
    const { getByText } = jobCardComp;

    const rejectBtn = getByText("No Thanks");
    fireEvent.press(rejectBtn);
    expect(rejectAction).toHaveBeenCalledTimes(1);

    const acceptBtn = getByText("I'll Take It");
    fireEvent.press(acceptBtn);
    expect(acceptAction).toHaveBeenCalledTimes(1);
  });
});
