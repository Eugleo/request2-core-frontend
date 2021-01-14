import { useAuth } from '../../Utils/Auth';
import { useAuthState } from '../../Utils/AuthContext';
import { Option, Question, SingleChoice } from './Question';

export function TeamField({ id }: { id: string }): JSX.Element {
  const { auth } = useAuth();

  return (
    <div>
      <Question>Which team should be billed for this request?</Question>
      <SingleChoice id={id} required>
        {auth.user.teams.map(t => (
          <Option key={t._id} value={t._id} label={t.name} />
        ))}
      </SingleChoice>
    </div>
  );
}
