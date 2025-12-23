import { describe, it, expect } from "vitest";
import { getFormattedDates, ScheduleResponse } from "./lib";
import { type } from "arktype";

describe("getFormattedDates", () => {
  it("formats a single date correctly", () => {
    const result = getFormattedDates("28-12-2025", "28-12-2025");
    expect(result).toEqual(["28/12 Sunday"]);
  });

  it("formats a date range correctly", () => {
    const result = getFormattedDates("28-12-2025", "30-12-2025");
    expect(result).toEqual(["28/12 Sunday", "29/12 Monday", "30/12 Tuesday"]);
  });

  it("handles leap year correctly", () => {
    const result = getFormattedDates("30-12-2025", "02-01-2026");
    expect(result).toEqual([
      "30/12 Tuesday",
      "31/12 Wednesday",
      "01/01 Thursday",
      "02/01 Friday",
    ]);
  });

  it("handles month transition correctly", () => {
    const result = getFormattedDates("28-02-2024", "01-03-2024");
    expect(result).toEqual([
      "28/02 Wednesday",
      "29/02 Thursday",
      "01/03 Friday",
    ]);
  });

  it("pads single digit days and months with zeros", () => {
    const result = getFormattedDates("01-01-2025", "03-01-2025");
    expect(result).toEqual([
      "01/01 Wednesday",
      "02/01 Thursday",
      "03/01 Friday",
    ]);
  });

  it("handles a longer date range", () => {
    const result = getFormattedDates("25-12-2025", "31-12-2025");
    expect(result).toHaveLength(7);
    expect(result[0]).toBe("25/12 Thursday");
    expect(result[6]).toBe("31/12 Wednesday");
  });
});

describe("ScheduleResponse", () => {
  it("validates correct data with string content", () => {
    const validData = {
      data: {
        "28": {
          times: [
            ["10:00-11:00", "Breakfast"],
            ["11:00-12:00", "Welcome"],
          ],
        },
      },
    };

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("validates correct data with workshop array content", () => {
    const validData = {
      data: {
        "29": {
          times: [
            [
              "14:00-15:30",
              [
                {
                  name: "Acro",
                  teachers: "John Doe",
                  prereqs: "None",
                  level: "Beginner",
                },
                {
                  name: "Handstands",
                  teachers: "Jane Doe",
                  prereqs: "Plank",
                  level: "Intermediate",
                },
              ],
            ],
          ],
        },
      },
    };

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("fails validation when data structure is incorrect", () => {
    const invalidData = {
      data: {
        "28": {
          // Missing 'times' array
          events: [],
        },
      },
    };

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("fails validation when workshop data is missing fields", () => {
    const invalidData = {
      data: {
        "29": {
          times: [
            [
              "14:00-15:30",
              [
                {
                  name: "Acro",
                  // Missing teachers, prereqs, level
                },
              ],
            ],
          ],
        },
      },
    };

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("fails validation when time slot tuple is invalid", () => {
    const invalidData = {
      data: {
        "28": {
          times: [
            // Should be a tuple of [string, string | Workshop[]]
            "10:00-11:00",
          ],
        },
      },
    };

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("trims whitespace from string fields", () => {
    const dirtyData = {
      data: {
        "28": {
          times: [[" 10:00-11:00 ", " Breakfast "]],
        },
      },
    };
    const expectedData = {
      data: {
        "28": {
          times: [["10:00-11:00", "Breakfast"]],
        },
      },
    };
    const result = ScheduleResponse(dirtyData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(expectedData);
  });

  it("normalizes whitespace in workshop fields", () => {
    const dirtyData = {
      data: {
        "29": {
          times: [
            [
              "14:00-15:30",
              [
                {
                  name: "  Acro   Yoga  ",
                  teachers: " John   Doe ",
                  prereqs: "  None  ",
                  level: " Beginner ",
                },
              ],
            ],
          ],
        },
      },
    };
    const expectedData = {
      data: {
        "29": {
          times: [
            [
              "14:00-15:30",
              [
                {
                  name: "Acro Yoga",
                  teachers: "John Doe",
                  prereqs: "None",
                  level: "Beginner",
                },
              ],
            ],
          ],
        },
      },
    };
    const result = ScheduleResponse(dirtyData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(expectedData);
  });

  it("fails validation when required workshop fields are empty", () => {
    const invalidData = {
      data: {
        "29": {
          times: [
            [
              "14:00-15:30",
              [
                {
                  name: "   ", // Empty after trim
                  teachers: "John Doe",
                  prereqs: "None",
                  level: "Beginner",
                },
              ],
            ],
          ],
        },
      },
    };

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("allows empty prereqs", () => {
    const validData = {
      data: {
        "29": {
          times: [
            [
              "14:00-15:30",
              [
                {
                  name: "Acro",
                  teachers: "John Doe",
                  prereqs: "   ", // Should become ""
                  level: "Beginner",
                },
              ],
            ],
          ],
        },
      },
    };
    const expectedData = {
      data: {
        "29": {
          times: [
            [
              "14:00-15:30",
              [
                {
                  name: "Acro",
                  teachers: "John Doe",
                  prereqs: "",
                  level: "Beginner",
                },
              ],
            ],
          ],
        },
      },
    };

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(expectedData);
  });
});
