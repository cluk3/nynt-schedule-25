import { type } from "arktype";

export function getFormattedDates(startDate: string, endDate: string) {
  // Parse the input dates
  const startParts = startDate.split("-");
  const endParts = endDate.split("-");
  const start = new Date(
    parseInt(startParts[2]),
    parseInt(startParts[1]) - 1,
    parseInt(startParts[0]),
  );
  const end = new Date(
    parseInt(endParts[2]),
    parseInt(endParts[1]) - 1,
    parseInt(endParts[0]),
  );

  const formattedDates = [];

  // Iterate over the range of dates
  let current = new Date(start);
  while (current <= end) {
    // Format the current date as "dd/mm week day"
    const day = String(current.getDate()).padStart(2, "0");
    const month = current.toLocaleString("en-GB", { month: "short" });
    const formattedDate = {
      day,
      month,
      year: current.getFullYear(),
    };

    formattedDates.push(formattedDate);

    // Move to the next day
    current.setDate(current.getDate() + 1);
  }

  return formattedDates;
}
const trimBetween = (s: string) => s.replaceAll(/\s+/g, " ").trim();
const nonEmptyTrimmedString = type("string").pipe(trimBetween).to("string > 0");
export const Workshop = type({
  name: nonEmptyTrimmedString,
  teachers: nonEmptyTrimmedString,
  prereqs: type("string").pipe(trimBetween),
  level: nonEmptyTrimmedString,
});

export type Workshop = typeof Workshop.infer;

export const TimeSlot = type([
  nonEmptyTrimmedString,
  type(nonEmptyTrimmedString).or(Workshop.array().atLeastLength(1)),
]);

export const DaySchedule = type({
  times: TimeSlot.array().atLeastLength(1),
});

export const ScheduleResponse = type({
  data: {
    "27": DaySchedule,
    "28": DaySchedule,
    "29": DaySchedule,
    "30": DaySchedule,
    "31": DaySchedule,
    "01": DaySchedule,
    "02": DaySchedule,
    "03": DaySchedule,
    "04": DaySchedule,
  },
});
