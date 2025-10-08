import { act, render } from "@testing-library/react-native";

import { JobMatch } from "@/hooks/workerStores";
import JobMatchList from "../JobMatchList";

const fakeJobMatches: JobMatch[] = [
  {
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
  },
];

describe("JobMatchList component", () => {
  test("renders correctly when loading", () => {
    const jobMatchListComp = render(<JobMatchList data={[]} loading={true} />);
    const { getByAccessibilityHint } = jobMatchListComp;

    getByAccessibilityHint("loading");
  });

  test("renders correctly when have error", () => {
    const error = { message: "Error 404 not found" };
    const jobMatchListComp = render(
      <JobMatchList data={[]} loading={false} error={error as any} />
    );
    const { getByText } = jobMatchListComp;

    getByText(`${error.message}. Please try refreshing, otherwise contact SwipeJobs for support.`);
  });

  test("renders correctly when loaded", () => {
    const jobMatchListComp = render(<JobMatchList data={fakeJobMatches} loading={false} />);
    const { getByAccessibilityHint, getByText } = jobMatchListComp;

    const img = getByAccessibilityHint("job image");
    expect(img.props.source.uri).toBe(fakeJobMatches[0].jobTitle.imageUrl);
    getByText(fakeJobMatches[0].jobTitle.name);
    // will assume the rest of the texts have displayed properly
  });

  test("able to refresh if function is passed", () => {
    const refreshAction = jest.fn();
    const jobMatchListComp = render(
      <JobMatchList data={fakeJobMatches} loading={false} refreshAction={refreshAction} />
    );
    const { getByTestId } = jobMatchListComp;
    const flatList = getByTestId("jobMatchList");
    act(() => {
      flatList.props.refreshControl.props.onRefresh();
    });
    expect(refreshAction).toHaveBeenCalledTimes(1);
  });
});
