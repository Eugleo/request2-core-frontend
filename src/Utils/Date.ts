export function formatDate(unixTime: number): string {
  const d = new Date(unixTime * 1000);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function timestamp(unixtime: number): string {
  const locale = 'cs-CZ';
  const date = new Date(unixtime * 1000);
  return `${date.toLocaleDateString(locale)}, ${date.toLocaleTimeString(locale)}`;
}
