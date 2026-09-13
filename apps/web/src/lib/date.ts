const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"] as const;

/** Formats an ISO date identically in Node, Chromium, Firefox, and WebKit. */
export function formatShortDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;

  const [, year, month, day] = match;
  const monthName = SHORT_MONTHS[Number(month) - 1];
  return monthName ? `${day} ${monthName} ${year}` : value;
}

