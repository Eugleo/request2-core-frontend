import c from 'classnames';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

export function Link({ className, ...props }: LinkProps): JSX.Element {
  return <RouterLink {...props} className={c(className, 'text-green-500 hover:text-green-600')} />;
}
