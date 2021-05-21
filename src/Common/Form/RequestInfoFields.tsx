import { useAuth } from '../../Utils/Auth';
import { comparing } from '../../Utils/Func';
import { Option, SingleChoice } from './NewChoiceField';

export function TeamField({ id }: { id: string }): JSX.Element {
  const { auth } = useAuth();

  return (
    <SingleChoice
      q="Which of your teams should be associated with this request?"
      id={id}
      autoFillIn
    >
      {auth.user.teams.sort(comparing(t => t.name)).map(t => (
        <Option key={t._id} value={t._id.toString()} label={t.name} />
      ))}
    </SingleChoice>
  );
}
