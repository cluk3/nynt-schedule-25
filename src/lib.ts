export function getFormattedDates(startDate: string, endDate: string) {
  // Parse the input dates
  const startParts = startDate.split("-");
  const endParts = endDate.split("-");
  // @ts-expect-error
  const start = new Date(startParts[2], startParts[1] - 1, startParts[0]);
  // @ts-expect-error
  const end = new Date(endParts[2], endParts[1] - 1, endParts[0]);

  const formattedDates = [];

  // Iterate over the range of dates
  let current = new Date(start);
  while (current <= end) {
    // Format the current date as "dd/mm week day"
    const day = String(current.getDate()).padStart(2, "0");
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const weekDay = current.toLocaleString("en-GB", { weekday: "long" });
    const formattedDate = `${day}/${month} ${weekDay}`;

    formattedDates.push(formattedDate);

    // Move to the next day
    current.setDate(current.getDate() + 1);
  }

  return formattedDates;
}

export type Workshop = {
  name: string;
  teachers: string;
  prereqs: string;
  level: string;
};
