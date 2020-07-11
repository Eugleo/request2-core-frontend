export default function formatDate(unixTime) {
  const d = new Date(unixTime * 1000);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function timestamp(unixtime) {
  const locale = 'cs-CZ';
  const date = new Date(unixtime * 1000);
  return `${date.toLocaleDateString(locale)}, ${date.toLocaleTimeString(locale)}`;
}
