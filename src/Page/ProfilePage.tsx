import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { Primary } from '../Common/Buttons';
import { ShortTextInput } from '../Common/Form/NewTextField';
import { Question, reqRule } from '../Common/Form/Question';
import { Page } from '../Common/Layout';
import { Pill } from '../Common/Table';
import { UserDetails } from '../User/User';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';

export function MyProfilePage(): JSX.Element {
  const { auth } = useAuth();
  return <ProfilePage user={auth.user} />;
}

// TODO Add validation and better error reporting
export function ProfilePage({ user }: { user: WithID<UserDetails> }): JSX.Element {
  const { authPut } = useAuth();
  const { register, errors, handleSubmit } = useForm<{ name: string }>({
    defaultValues: {
      name: '',
    },
  });

  return (
    <Page title="Profile">
      <div className="px-6 mb-6">
        <Section title="Account details">
          <form
            className="mb-6"
            onSubmit={handleSubmit(async ({ name }) => {
              const r = await authPut('/me', {
                name,
              });

              if (r.ok) {
                console.log('Display name successfully updated');
              } else {
                const js = await r.json();
                console.log(js.error);
              }
            })}
          >
            <div>
              <Question>Display name</Question>
              <ShortTextInput name="name" errors={errors} reg={register(reqRule())} />
            </div>
            <div>
              <Question>E-mail address</Question>
              <ShortTextInput name="email" disabled />
            </div>
            <div className="mt-2 flex flex-row-reverse">
              <Primary type="submit">Save changes</Primary>
            </div>
          </form>
          <Question>Research groups</Question>
          <div className="flex flex-row space-x-2 mb-6">
            {user.teams.map(t => (
              <Pill key={t._id} text={t.name} className="bg-gray-200 text-gray-900" />
            ))}
          </div>
          <Question>Privileges</Question>

          <div className="flex flex-row space-x-2">
            {user.roles.map(r => (
              <Pill key={r} text={r} className="bg-gray-200 text-gray-900" />
            ))}
          </div>
        </Section>
      </div>
    </Page>
  );
}

function PasswordSection() {
  const { register, errors, watch, handleSubmit } = useForm<{
    newPassword: string;
    password: string;
    passwordCheck: string;
  }>({
    defaultValues: {
      newPassword: '',
      password: '',
      passwordCheck: '',
    },
  });

  const { authPost } = useAuth();

  return (
    <Section title="Change password">
      <form
        onSubmit={handleSubmit(async values => {
          const r = await authPost('/-password', {
            old: values.password,
            new: values.newPassword,
          });

          if (r.ok) {
            console.log('Password succesfully chanegd');
          } else {
            const js = await r.json();
            console.log(js.error);
          }
        })}
      >
        <div>
          <Question>Old password</Question>
          <ShortTextInput
            name="password"
            type="password"
            errors={errors}
            reg={register(reqRule())}
          />
        </div>
        <div>
          <Question>Enter the new password</Question>
          <ShortTextInput
            name="newPassword"
            errors={errors}
            reg={register(reqRule())}
            type="password"
          />
        </div>
        <div>
          <Question>Repeat the new password</Question>
          <ShortTextInput
            name="newPasswordCheck"
            errors={errors}
            reg={register(reqRule())}
            type="password"
          />
        </div>
        <div className="mt-2 flex flex-row-reverse">
          <Primary type="submit">Change password</Primary>
        </div>
      </form>
    </Section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl text-gray-900 font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
