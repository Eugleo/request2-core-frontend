import { Form, Formik } from 'formik';
import { ReactNode } from 'react';

import { Primary } from '../Common/Buttons';
import { FieldLabel } from '../Common/Form/General';
import { ShortText } from '../Common/Form/TextField';
import { Page } from '../Common/Layout';
import { Pill } from '../Common/Table';
import { createShortTextValue } from '../Request/FieldValue';
import { UserDetails } from '../User/User';
import { useAuth } from '../Utils/Auth';
import { WithID } from '../Utils/WithID';

export function MyProfilePage(): JSX.Element {
  const { auth } = useAuth();
  return <ProfilePage user={auth.user} />;
}

// TODO Add validation and better error reporting
export function ProfilePage({ user }: { user: WithID<UserDetails> }): JSX.Element {
  const { authPost, authPut } = useAuth();
  return (
    <Page title="Profile">
      <div className="px-6 mb-6">
        <Section title="Account details">
          <Formik
            initialValues={{
              email: createShortTextValue('TODO sample email'),
              name: createShortTextValue(user.name),
            }}
            onSubmit={async values => {
              const r = await authPut('/me', {
                name: values.name.content,
              });

              if (r.ok) {
                console.log('Display name successfully d');
              } else {
                const js = await r.json();
                console.log(js.error);
              }
            }}
          >
            <Form className="mb-6">
              <ShortText path="name" label="Display name" />
              <ShortText
                path="email"
                label="Email"
                description="Your email is also used as your username"
                disabled
              />
              <div className="mt-2 flex flex-row-reverse">
                <Primary type="submit">Save changes</Primary>
              </div>
            </Form>
          </Formik>
          <FieldLabel text="Research groups" />
          <div className="grid col-gap-2 grid-flow-col auto-cols-max mb-6 mt-2">
            {user.teams.map(t => (
              <Pill key={t._id} text={t.name} className="bg-gray-200 text-gray-900" />
            ))}
          </div>
          <FieldLabel text="Privileges" />
          <div className="grid col-gap-2 grid-flow-col auto-cols-max mb-6 mt-2">
            {user.roles.map(r => (
              <Pill key={r} text={r} className="bg-gray-200 text-gray-900" />
            ))}
          </div>
        </Section>

        <Section title="Change password">
          <Formik
            initialValues={{
              password: createShortTextValue(),
              newPassword: createShortTextValue(),
              newPasswordCheck: createShortTextValue(),
            }}
            onSubmit={async values => {
              const r = await authPost('/-password', {
                old: values.password.content,
                new: values.newPassword.content,
              });

              if (r.ok) {
                console.log('Password succesfully d');
              } else {
                const js = await r.json();
                console.log(js.error);
              }
            }}
          >
            <Form>
              <ShortText path="password" label="Old password" type="password" />
              <ShortText path="newPassword" label="New password" type="password" />
              <ShortText path="newPasswordCheck" label="New password (again)" type="password" />
              <div className="mt-2 flex flex-row-reverse">
                <Primary type="submit">Change password</Primary>
              </div>
            </Form>
          </Formik>
        </Section>
      </div>
    </Page>
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
