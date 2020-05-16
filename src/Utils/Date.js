export default function formatDate(unixTime) {
  const d = new Date(unixTime * 1000);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}
