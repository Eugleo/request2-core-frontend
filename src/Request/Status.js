export function statusStyle(status) {
  switch (status) {
    case 'Pending':
      return 'bg-blue-100 text-blue-500 border border-blue-300 hover:border-blue-500';
    case 'In Progress':
      return 'bg-orange-100 text-orange-600 border border-orange-300 hover:border-orange-500';
    case 'Done':
      return 'bg-green-100 text-green-500 border border-green-300 hover:border-green-500';
    case 'Awaiting Input':
      return 'bg-red-100 text-red-400 border border-red-300 hover:border-red-500';
    default:
      return 'bg-purple-100 text-purple-400 border border-purple-300 hover:border-purple-500';
  }
}

export function statusStyleHover(status) {
  switch (status) {
    case 'Pending':
      return 'hover:bg-blue-100 hover:text-blue-500';
    case 'In Progress':
      return 'hover:bg-orange-100 hover:text-orange-600';
    case 'Done':
      return 'hover:bg-green-100 hover:text-green-500';
    case 'Awaiting Input':
      return 'hover:bg-red-100 hover:text-red-400';
    default:
      return 'hover:bg-purple-100 hover:text-purple-400';
  }
}
