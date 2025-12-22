import { describe, it, expect } from "vitest";
import { ScheduleResponse } from "./lib";
import { type } from "arktype";

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
    console.log(result);
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
