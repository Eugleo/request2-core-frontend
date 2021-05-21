import { ReactNode } from 'react';
import { LogOut } from 'react-feather';
import { useForm } from 'react-hook-form';

import { Primary, Secondary, Tertiary } from '../Common/Buttons';
import { ShortTextInput } from '../Common/Form/NewTextField';
import { Question, reqRule } from '../Common/Form/Question';
import { Body, Card, ContentWrapper, Header, Page, Spacer, Title } from '../Common/Layout';
import { Pill } from '../Common/Table';
import { UserDetails } from '../User/User';
import { useAuth } from '../Utils/Auth';
import { useAuthDispatch } from '../Utils/AuthContext';
import { WithID } from '../Utils/WithID';

export function MyProfilePage(): JSX.Element {
  const { auth } = useAuth();
  return <ProfilePage user={auth.user} />;
}

// TODO Add validation and better error reporting
export function ProfilePage({ user }: { user: WithID<UserDetails> }): JSX.Element {
  const { authPut, authPost, auth } = useAuth();
  const dispatch = useAuthDispatch();
  const { register, errors, handleSubmit } = useForm<{ name: string }>({
    defaultValues: {
      name: user.name,
    },
  });

  return (
    <ContentWrapper>
      <div className="max-w-4xl mx-auto w-full">
        <Header>
          <Title>{`${auth.user.name}`}</Title>
          <Spacer />
          <Secondary
            status="Danger"
            onClick={async () => {
              const r = await authPost('/logout', {});
              if (r.ok) {
                localStorage.removeItem('apiKey');
                dispatch({ type: 'LOGOUT' });
              } else {
                const body = await r.text();
                console.log(`Couldn't log out, response body was ${body}`);
              }
            }}
          >
            Log out
          </Secondary>
        </Header>
        <Body>
          <div className="space-y-6">
            <Section title="Basic information">
              <form
                className="space-y-6"
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
                <div className="space-y-6 p-6">
                  <div>
                    <Question required>Display name</Question>
                    <ShortTextInput name="name" errors={errors} reg={register(reqRule())} />
                  </div>
                  <div>
                    <Question showIcons={false}>E-mail address</Question>
                    <ShortTextInput name="email" disabled />
                  </div>
                </div>
                <Footer>
                  <Primary type="submit">Save changes</Primary>
                </Footer>
              </form>
            </Section>

            <PasswordSection />

            <Section title="Account details">
              <div className="p-6">
                <div>
                  <Question showIcons={false}>Research groups</Question>
                  <div className="flex flex-row space-x-2 mb-6">
                    {user.teams.map(t => (
                      <Pill
                        key={t._id}
                        text={t.name}
                        className="bg-gray-100 text-gray-900 border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Question showIcons={false}>Privileges</Question>
                  <div className="flex flex-row space-x-2">
                    {user.roles.map(r => (
                      <Pill
                        key={r}
                        text={r}
                        className="bg-gray-100 text-gray-900 border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </Body>
      </div>
    </ContentWrapper>
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
        className="space-y-6"
      >
        <div className="space-y-6 p-6">
          <div>
            <Question required>Old password</Question>
            <ShortTextInput
              name="password"
              type="password"
              errors={errors}
              reg={register(reqRule())}
            />
          </div>
          <div>
            <Question required>Enter the new password</Question>
            <ShortTextInput
              name="newPassword"
              errors={errors}
              reg={register(reqRule())}
              type="password"
            />
          </div>
          <div>
            <Question required>Repeat the new password</Question>
            <ShortTextInput
              name="newPasswordCheck"
              errors={errors}
              reg={register(reqRule())}
              type="password"
            />
          </div>
        </div>
        <Footer>
          <Primary type="submit">Change password</Primary>
        </Footer>
      </form>
    </Section>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="flex justify-end w-full px-6 py-3 bg-gray-50">{children}</div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <h2 className="font-medium text-lg sticky top-3">{title}</h2>
      </div>
      <div className="col-span-2">
        <Card className="overflow-hidden">{children}</Card>
      </div>
    </div>
  );
}
