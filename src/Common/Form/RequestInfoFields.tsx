import { useAuth } from '../../Utils/Auth';
import { Option, Question, SingleChoice } from './Question';

export function TeamField({ id }: { id: string }): JSX.Element {
  const { auth } = useAuth();

  return (
    <>
      <Question>Which of your teams should be associated with this request?</Question>
      <SingleChoice id={id} required>
        {auth.user.teams.map(t => (
          <Option key={t._id} value={t._id} label={t.name} />
        ))}
      </SingleChoice>
    </>
  );
}
