import { act, renderHook } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";

import {
  JobActionResponse,
  JobMatch,
  Profile,
  useJobActionStore,
  useJobMatchesStore,
  useProfileStore,
  worker,
} from "../workerStores";

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

const fakeProfile: Profile = {
  address: {
    formattedAddress: "6834 Hollywood Blvd, Los Angeles, California 90028-6102, US",
    zoneId: "America/Los_Angeles",
  },
  email: "sheev.palpatine@jedisucks.com",
  firstName: "Sheev",
  lastName: "Palpatine",
  maxJobDistance: 1,
  phoneNumber: "6660690420",
  workerId: "666",
};

const fakeJobActionResponse: JobActionResponse = {
  success: false,
  message: "Sorry, this role was no longer available",
  errorCode: "FAIL-101",
};

const actionPassResponse: JobActionResponse = {
  success: true,
};

const mock = new MockAdapter(worker);
const baseURL = "https://test.swipejobs.com/api/worker";
const workerId = "666";

beforeEach(() => {
  mock.reset();
});

describe("useJobMatchesStore", () => {
  test("returns error if fetchJobs fail", async () => {
    const { result } = renderHook(() => useJobMatchesStore());
    expect(result.current.jobMatches).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await act(() => result.current.fetchJobs(workerId));
    expect(result.current.jobMatches).toBeUndefined();
    expect(result.current.error?.status).toBe(404);

    act(() => result.current.reset()); // reset store so other test cases will start from scratch
  });

  test("returns data if fetchJobs doesn't fail", async () => {
    mock.onGet(`${baseURL}/${workerId}/matches`).reply(200, fakeJobMatches);
    const { result } = renderHook(() => useJobMatchesStore());
    expect(result.current.jobMatches).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await act(() => result.current.fetchJobs(workerId));
    expect(result.current.jobMatches).toEqual(fakeJobMatches);
    expect(result.current.error).toBeUndefined();
    expect(result.current.getJobDetails("12345")).toEqual(fakeJobMatches[0]);

    act(() => result.current.reset()); // reset store so other test cases will start from scratch
  });
});

describe("useJobActionStore", () => {
  const jobId = "123";

  describe("acceptJob", () => {
    test("returns http error if accept fail due to job missing", async () => {
      const { result } = renderHook(() => useJobActionStore());
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      await act(() => result.current.acceptJob(jobId, workerId));
      expect(result.current.success).toBe(false);
      expect(result.current.message).not.toBeUndefined();
      expect(result.current.errorCode).toContain("HTTP-");

      act(() => result.current.reset()); // reset store so other test cases will start from scratch
    });

    test("returns non-http error if accept fail due to job no longer available", async () => {
      mock.onGet(`${baseURL}/${workerId}/job/${jobId}/accept`).reply(200, fakeJobActionResponse);
      const { result } = renderHook(() => useJobActionStore());
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      await act(() => result.current.acceptJob(jobId, workerId));
      expect(result.current.success).toBe(false);
      expect(result.current.message).toBe(fakeJobActionResponse.message);
      expect(result.current.errorCode).toBe(fakeJobActionResponse.errorCode);

      act(() => result.current.reset()); // reset store so other test cases will start from scratch
    });

    test("returns success if accept pass", async () => {
      mock.onGet(`${baseURL}/${workerId}/job/${jobId}/accept`).reply(200, actionPassResponse);
      const { result } = renderHook(() => useJobActionStore());
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      await act(() => result.current.acceptJob(jobId, workerId));
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      act(() => result.current.reset()); // reset store so other test cases will start from scratch
    });
  });

  describe("rejectJob", () => {
    test("returns http error if reject fail due to job missing", async () => {
      const { result } = renderHook(() => useJobActionStore());
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      await act(() => result.current.rejectJob(jobId, workerId));
      expect(result.current.success).toBe(false);
      expect(result.current.message).not.toBeUndefined();
      expect(result.current.errorCode).toContain("HTTP-");

      act(() => result.current.reset()); // reset store so other test cases will start from scratch
    });

    test("returns non-http error if reject fail due to job no longer available", async () => {
      mock.onGet(`${baseURL}/${workerId}/job/${jobId}/reject`).reply(200, fakeJobActionResponse);
      const { result } = renderHook(() => useJobActionStore());
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      await act(() => result.current.rejectJob(jobId, workerId));
      expect(result.current.success).toBe(false);
      expect(result.current.message).toBe(fakeJobActionResponse.message);
      expect(result.current.errorCode).toBe(fakeJobActionResponse.errorCode);

      act(() => result.current.reset()); // reset store so other test cases will start from scratch
    });

    test("returns success if reject pass", async () => {
      mock.onGet(`${baseURL}/${workerId}/job/${jobId}/reject`).reply(200, actionPassResponse);
      const { result } = renderHook(() => useJobActionStore());
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      await act(() => result.current.rejectJob(jobId, workerId));
      expect(result.current.success).toBe(true);
      expect(result.current.message).toBeUndefined();
      expect(result.current.errorCode).toBeUndefined();

      act(() => result.current.reset()); // reset store so other test cases will start from scratch
    });
  });
});

describe("useProfileStore", () => {
  test("returns error if fetchProfile fail", async () => {
    const { result } = renderHook(() => useProfileStore());
    expect(result.current.profile).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await act(() => result.current.fetchProfile(workerId));
    expect(result.current.profile).toBeUndefined();
    expect(result.current.error?.status).toBe(404);

    act(() => result.current.reset()); // reset store so other test cases will start from scratch
  });

  test("returns data if fetchProfile doesn't fail", async () => {
    mock.onGet(`${baseURL}/${workerId}/profile`).reply(200, fakeProfile);
    const { result } = renderHook(() => useProfileStore());
    expect(result.current.profile).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await act(() => result.current.fetchProfile(workerId));
    expect(result.current.profile).toEqual(fakeProfile);
    expect(result.current.error).toBeUndefined();

    act(() => result.current.reset()); // reset store so other test cases will start from scratch
  });
});
