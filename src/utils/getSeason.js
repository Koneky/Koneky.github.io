const validSeasons = new Set([
  "spring",
  "summer",
  "autumn",
  "winter"
]);

export function getCalendarSeason(monthIndex) {
  if (monthIndex === 11 || monthIndex <= 1) {
    return "winter";
  }

  if (monthIndex <= 4) {
    return "spring";
  }

  if (monthIndex <= 7) {
    return "summer";
  }

  return "autumn";
}

export function getSeason(search = '', date = new Date()) {
  const params = new URLSearchParams(search);
  const override = params.get('season');

  if (override && validSeasons.has(override)) {
    return override;
  }

  return getCalendarSeason(date.getMonth());
}
