import { describe, it, expect } from "vitest";
import { getFormattedDates, ScheduleResponse } from "./lib";
import { type } from "arktype";

/**
 * Helper function to build a complete schedule with all required days.
 * Allows overriding specific days with custom data.
 */
function buildScheduleData(overrides: Record<string, any> = {}) {
  const defaultDay = () => ({ times: [["10:00-11:00", "Breakfast"]] });
  const data = {
    "27": defaultDay(),
    "28": defaultDay(),
    "29": defaultDay(),
    "30": defaultDay(),
    "31": defaultDay(),
    "01": defaultDay(),
    "02": defaultDay(),
    "03": defaultDay(),
    "04": defaultDay(),
  };

  // Merge overrides into data
  return {
    data: { ...data, ...overrides },
  };
}

describe("getFormattedDates", () => {
  it("formats a single date correctly", () => {
    const result = getFormattedDates("28-12-2025", "28-12-2025");
    expect(result).toEqual([{ day: "28", month: "Dec", year: 2025 }]);
  });

  it("formats a date range correctly", () => {
    const result = getFormattedDates("28-12-2025", "30-12-2025");
    expect(result).toEqual([
      { day: "28", month: "Dec", year: 2025 },
      { day: "29", month: "Dec", year: 2025 },
      { day: "30", month: "Dec", year: 2025 },
    ]);
  });

  it("handles year transition correctly", () => {
    const result = getFormattedDates("30-12-2025", "02-01-2026");
    expect(result).toEqual([
      { day: "30", month: "Dec", year: 2025 },
      { day: "31", month: "Dec", year: 2025 },
      { day: "01", month: "Jan", year: 2026 },
      { day: "02", month: "Jan", year: 2026 },
    ]);
  });

  it("handles month transition correctly", () => {
    const result = getFormattedDates("28-02-2024", "01-03-2024");
    expect(result).toEqual([
      { day: "28", month: "Feb", year: 2024 },
      { day: "29", month: "Feb", year: 2024 },
      { day: "01", month: "Mar", year: 2024 },
    ]);
  });

  it("pads single digit days with zeros", () => {
    const result = getFormattedDates("01-01-2025", "03-01-2025");
    expect(result).toEqual([
      { day: "01", month: "Jan", year: 2025 },
      { day: "02", month: "Jan", year: 2025 },
      { day: "03", month: "Jan", year: 2025 },
    ]);
  });

  it("handles a longer date range", () => {
    const result = getFormattedDates("25-12-2025", "31-12-2025");
    expect(result).toHaveLength(7);
    expect(result[0]).toEqual({ day: "25", month: "Dec", year: 2025 });
    expect(result[6]).toEqual({ day: "31", month: "Dec", year: 2025 });
  });
});

describe("ScheduleResponse", () => {
  // Tests cover:
  // - Basic validation with string and workshop content
  // - Mixed content (strings and workshops in same day)
  // - Whitespace trimming and normalization
  // - Empty/missing fields validation
  // - Unicode, special characters, and long strings
  // - Multiple time slots and workshops
  // - Edge cases (empty arrays, minimal valid data, missing required days)

  it("validates correct data with string content", () => {
    const validData = buildScheduleData({
      "27": { times: [["10:00-11:00", "Setup"]] },
      "28": {
        times: [
          ["10:00-11:00", "Breakfast"],
          ["11:00-12:00", "Welcome"],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("validates correct data with workshop array content", () => {
    const validData = buildScheduleData({
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
    });

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
    const dirtyData = buildScheduleData({
      "27": { times: [[" 10:00-11:00 ", " Setup "]] },
    });
    const expectedData = buildScheduleData({
      "27": { times: [["10:00-11:00", "Setup"]] },
    });
    const result = ScheduleResponse(dirtyData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(expectedData);
  });

  it("normalizes whitespace in workshop fields", () => {
    const dirtyData = buildScheduleData({
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
    });
    const expectedData = buildScheduleData({
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
    });
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
    const validData = buildScheduleData({
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
    });
    const expectedData = buildScheduleData({
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
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(expectedData);
  });

  it("validates mixed string and workshop content in same day", () => {
    const validData = buildScheduleData({
      "29": {
        times: [
          ["10:00-11:00", "Breakfast"],
          [
            "14:00-15:30",
            [
              {
                name: "Acro",
                teachers: "John Doe",
                prereqs: "None",
                level: "Beginner",
              },
            ],
          ],
          ["18:00-19:00", "Dinner"],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("fails validation when workshop array is empty", () => {
    const invalidData = buildScheduleData({
      "29": {
        times: [["14:00-15:30", []]],
      },
    });

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("validates multiple workshops in single time slot", () => {
    const validData = buildScheduleData({
      "29": {
        times: [
          [
            "14:00-15:30",
            [
              {
                name: "Workshop 1",
                teachers: "Teacher 1",
                prereqs: "",
                level: "All",
              },
              {
                name: "Workshop 2",
                teachers: "Teacher 2",
                prereqs: "Basic",
                level: "Int",
              },
              {
                name: "Workshop 3",
                teachers: "Teacher 3",
                prereqs: "None",
                level: "Adv",
              },
            ],
          ],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("handles unicode characters in workshop fields", () => {
    const validData = buildScheduleData({
      "29": {
        times: [
          [
            "14:00-15:30",
            [
              {
                name: "Acro Yoga 🧘‍♀️",
                teachers: "José García & François Müller",
                prereqs: "基本的な柔軟性",
                level: "Débutant/初級",
              },
            ],
          ],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("handles long strings in workshop fields", () => {
    const longName = "A".repeat(200);
    const longTeachers = "B".repeat(500);
    const longPrereqs = "C".repeat(1000);
    const longLevel = "D".repeat(100);

    const validData = buildScheduleData({
      "29": {
        times: [
          [
            "14:00-15:30",
            [
              {
                name: longName,
                teachers: longTeachers,
                prereqs: longPrereqs,
                level: longLevel,
              },
            ],
          ],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("handles special characters in strings", () => {
    const validData = buildScheduleData({
      "29": {
        times: [
          ["10:00-11:00", "Breakfast & Coffee ☕"],
          [
            "14:00-15:30",
            [
              {
                name: "Acro-Yoga (Partner Work)",
                teachers: "O'Brien, Smith-Jones & Co.",
                prereqs: "None/N/A",
                level: "All levels (18+)",
              },
            ],
          ],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("fails validation when missing required days", () => {
    const invalidData = {
      data: {
        "28": { times: [["10:00-11:00", "Breakfast"]] },
        "29": { times: [["10:00-11:00", "Breakfast"]] },
        // Missing days 27, 30, 31, 1, 2, 3, 4
      },
    };

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("fails validation when time slot has empty string content", () => {
    const invalidData = buildScheduleData({
      "29": {
        times: [["14:00-15:30", "   "]], // Empty after trim
      },
    });

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("fails validation when time range is empty", () => {
    const invalidData = buildScheduleData({
      "29": {
        times: [["   ", "Breakfast"]], // Empty after trim
      },
    });

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("validates minimal valid workshop (single character fields)", () => {
    const validData = buildScheduleData({
      "29": {
        times: [
          [
            "1",
            [
              {
                name: "A",
                teachers: "B",
                prereqs: "",
                level: "C",
              },
            ],
          ],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("validates multiple time slots in same day", () => {
    const validData = buildScheduleData({
      "29": {
        times: [
          ["08:00-09:00", "Registration"],
          ["09:00-10:00", "Breakfast"],
          ["10:00-11:30", "Opening Ceremony"],
          [
            "11:30-13:00",
            [
              {
                name: "Workshop A",
                teachers: "Teacher 1",
                prereqs: "",
                level: "Beginner",
              },
              {
                name: "Workshop B",
                teachers: "Teacher 2",
                prereqs: "",
                level: "Advanced",
              },
            ],
          ],
          ["13:00-14:30", "Lunch"],
          [
            "14:30-16:00",
            [
              {
                name: "Workshop C",
                teachers: "Teacher 3",
                prereqs: "",
                level: "Int",
              },
            ],
          ],
          ["19:00-22:00", "Evening Social"],
        ],
      },
    });

    const result = ScheduleResponse(validData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(validData);
  });

  it("fails validation when times array is empty", () => {
    const invalidData = buildScheduleData({
      "29": {
        times: [], // Must have at least one time slot
      },
    });

    const result = ScheduleResponse(invalidData);
    expect(result).toBeInstanceOf(type.errors);
  });

  it("normalizes newlines and tabs in strings", () => {
    const dirtyData = buildScheduleData({
      "29": {
        times: [["10:00-11:00", "Breakfast\n\tCoffee\t\tTea"]],
      },
    });
    const expectedData = buildScheduleData({
      "29": {
        times: [["10:00-11:00", "Breakfast Coffee Tea"]],
      },
    });

    const result = ScheduleResponse(dirtyData);
    expect(result).not.toBeInstanceOf(type.errors);
    expect(result).toEqual(expectedData);
  });
});
