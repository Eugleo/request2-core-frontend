import { useAuth } from '../../Utils/Auth';
import { Option, SingleChoice } from './NewChoiceField';

export function TeamField({ id }: { id: string }): JSX.Element {
  const { auth } = useAuth();

  return (
    <SingleChoice q="Which of your teams should be associated with this request?" id={id} required>
      {auth.user.teams.map(t => (
        <Option key={t._id} value={t._id} label={t.name} />
      ))}
    </SingleChoice>
  );
}
