import { ClassValue } from 'classnames/types';

export type Status = 'Pending' | 'InProgress' | 'Done' | 'AwaitingInput' | 'Deleted';

export function statusStyle(status: Status): string {
  switch (status) {
    case 'Pending':
      return 'bg-blue-100 text-blue-500 border border-blue-300';
    case 'InProgress':
      return 'bg-orange-100 text-orange-600 border border-orange-300';
    case 'Done':
      return 'bg-green-100 text-green-500 border border-green-300';
    case 'AwaitingInput':
      return 'bg-red-100 text-red-400 border border-red-300';
    default:
      return 'bg-purple-100 text-purple-400 border border-purple-300';
  }
}

export function statusStyleHover(status: Status): string {
  switch (status) {
    case 'Pending':
      return 'hover:bg-blue-100 hover:text-blue-500';
    case 'InProgress':
      return 'hover:bg-orange-100 hover:text-orange-600';
    case 'Done':
      return 'hover:bg-green-100 hover:text-green-500';
    case 'AwaitingInput':
      return 'hover:bg-red-100 hover:text-red-400';
    default:
      return 'hover:bg-purple-100 hover:text-purple-400';
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
