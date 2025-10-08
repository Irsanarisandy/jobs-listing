import { formatPhoneNumber, formatShiftDate } from "../stringFormatter";

describe("formatPhoneNumber", () => {
  test("returns USA format if number is 10 digits", () => {
    expect(formatPhoneNumber("2130010012")).toBe("(213) 001-0012");
  });

  test("returns original if number isn't 10 digits", () => {
    expect(formatPhoneNumber("21300100121")).toBe("21300100121");
  });
});

describe("formatShiftDate", () => {
  test("returns formatted shift date range for same day", () => {
    const fakeShiftDate = {
      startDate: "2025-09-12T21:00:00Z",
      endDate: "2025-09-13T05:00:00Z",
    };
    expect(formatShiftDate(fakeShiftDate)).toBe("FRI, SEP 12 @ 2:00 PM - 10:00 PM PDT");
  });

  test("returns formatted shift date range for different days", () => {
    const fakeShiftDate = {
      startDate: "2025-09-12T21:00:00Z",
      endDate: "2025-09-14T05:00:00Z",
    };
    expect(formatShiftDate(fakeShiftDate)).toBe("FRI, SEP 12 2:00 PM - SAT, SEP 13 10:00 PM PDT");
  });
});
