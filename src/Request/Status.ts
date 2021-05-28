export type Status = 'Pending' | 'InProgress' | 'Done' | 'AwaitingInput' | 'Deleted';

export function getStatusColor(status: Status): { general: string; indicator: string } {
  switch (status) {
    case 'InProgress':
      return { general: 'bg-blue-100 text-blue-900', indicator: 'bg-blue-400' };
    case 'Done':
      return { general: 'bg-green-100 text-green-900', indicator: 'bg-green-400' };
    case 'Pending':
      return { general: 'bg-yellow-100 text-yellow-900', indicator: 'bg-yellow-400' };
    case 'AwaitingInput':
      return { general: 'bg-purple-100 text-purple-900', indicator: 'bg-purple-400' };
    default:
      return { general: 'bg-red-100 text-red-900', indicator: 'bg-red-400' };
  }
}

export function statusToStr(status: Status): string {
  switch (status) {
    case 'InProgress':
      return 'In Progress';
    case 'Done':
      return 'Done';
    case 'Pending':
      return 'Pending';
    case 'AwaitingInput':
      return 'Awaiting Input';
    default:
      return 'Deleted';
  }
}

export function strToStatus(str: string): Status {
  switch (str.replace(' ', '')) {
    case 'InProgress':
      return 'InProgress';
    case 'Done':
      return 'Done';
    case 'Pending':
      return 'Pending';
    case 'AwaitingInput':
      return 'AwaitingInput';
    default:
      return 'Deleted';
  }
}
