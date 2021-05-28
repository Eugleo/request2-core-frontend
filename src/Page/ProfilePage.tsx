import { ReactNode } from 'react';
import { LogOut } from 'react-feather';
import { useForm } from 'react-hook-form';

import { Primary, Secondary, Tertiary } from '../Common/Buttons';
import { ShortTextInput } from '../Common/Form/NewTextField';
import { Description, Question, reqRule } from '../Common/Form/Question';
import * as Page from '../Common/Layout';
import { Pill } from '../Common/Pills';
import { UserDetails } from '../User/User';
import {
  UserContactInfo,
  UserOtherInfo,
  UserProfile,
  UserProfileHeader,
} from '../User/UserProfile';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { useAuthDispatch } from '../Utils/AuthContext';
import { WithID } from '../Utils/WithID';

export function MyProfilePage(): JSX.Element {
  const { auth } = useAuth();
  return <MyProfileBase id={auth.user._id} />;
}

function MyProfileBase({ id }: { id: number }) {
  const { Loader, result } = useAsyncGet<UserDetails>(`/users/${id}/profile`);
  const { authPost } = useAuth();
  const dispatch = useAuthDispatch();

  return (
    <Page.ContentWrapper>
      <div className="max-w-2xl mx-auto w-full">
        <UserProfileHeader Loader={Loader} result={result} />
        <Page.Body>
          <UserContactInfo Loader={Loader} />
          <UserOtherInfo Loader={Loader} />
          <div className="flex flex-row -mt-2">
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
          </div>
        </Page.Body>
      </div>
    </Page.ContentWrapper>
  );
}

type UserEdit = {
  name: string;
  telephone: string;
  room: string;
};

export function EditMyProfile(): JSX.Element {
  const { auth } = useAuth();
  return <ProfilePage user={auth.user} />;
}

// TODO Add validation and better error reporting
export function ProfilePage({ user }: { user: WithID<UserDetails> }): JSX.Element {
  const { authPost, auth } = useAuth();
  const { authPut } = useAuth<UserEdit>();
  const { register, errors, handleSubmit } = useForm<UserEdit>({
    defaultValues: {
      name: user.name,
      telephone: user.telephone,
      room: user.room,
    },
  });

  return (
    <Page.ContentWrapper>
      <div className="max-w-4xl mx-auto w-full">
        <Page.Header>
          <Page.Title>{`${auth.user.name}`}</Page.Title>
        </Page.Header>
        <Page.Body>
          <div className="space-y-6">
            <Section title="Basic information">
              <form
                className="space-y-6"
                onSubmit={handleSubmit(async ({ name, telephone, room }) => {
                  const r = await authPut('/me', {
                    name,
                    telephone,
                    room,
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
                    <ShortTextInput
                      name="name"
                      autoComplete="name"
                      errors={errors}
                      reg={register(reqRule())}
                    />
                  </div>
                  <div>
                    <Question showIcons={false}>E-mail address</Question>
                    <ShortTextInput name="email" disabled />
                  </div>
                  <div>
                    <Question required>Telephone number</Question>
                    <ShortTextInput
                      name="telephone"
                      placeholder="163"
                      reg={register(reqRule())}
                      errors={errors}
                    />
                    <Description>
                      Input either the IOCB telehpone number, or if need be your mobile number
                    </Description>
                  </div>
                  <div>
                    <Question required>Room</Question>
                    <ShortTextInput
                      name="room"
                      placeholder="A 1.89"
                      reg={register(reqRule())}
                      errors={errors}
                    />
                    <Description>
                      The pattern is '[building code] [floor number].[door number]'
                    </Description>
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
                        className="bg-gray-100 text-gray-900 border border-gray-200"
                      >
                        {t.name}
                      </Pill>
                    ))}
                  </div>
                </div>
                <div>
                  <Question showIcons={false}>Privileges</Question>
                  <div className="flex flex-row space-x-2">
                    {user.roles.map(r => (
                      <Pill key={r} className="bg-gray-100 text-gray-900 border border-gray-200">
                        {r}
                      </Pill>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </Page.Body>
      </div>
    </Page.ContentWrapper>
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
              autoComplete="current-password"
              errors={errors}
              reg={register(reqRule())}
            />
          </div>
          <div>
            <Question required>Enter the new password</Question>
            <ShortTextInput
              name="newPassword"
              errors={errors}
              autoComplete="new-password"
              reg={register(reqRule())}
              type="password"
            />
          </div>
          <div>
            <Question required>Repeat the new password</Question>
            <ShortTextInput
              name="newPasswordCheck"
              autoComplete="new-password"
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
        <Page.Card className="overflow-hidden">{children}</Page.Card>
      </div>
    </div>
  );
}
