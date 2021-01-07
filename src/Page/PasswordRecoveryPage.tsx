import { Form, Formik } from 'formik';
import { useParams } from 'react-router';

import { Primary } from '../Common/Buttons';
import { ShortText } from '../Common/Form/TextField';
import { createShortTextValue } from '../Request/FieldValue';
import * as Api from '../Utils/Api';
import keySrc from '../assets/key.png';

export function PasswordResetPageWithEmail(): JSX.Element {
  const { email } = useParams();
  return <PasswordResetPage email={email} />;
}

export function PasswordResetPage({ email }: { email: string | null }): JSX.Element {
  return (
    <div className="flex flex-col mx-auto items-center h-full justify-center max-w-md">
      <div className="mb-10 mx-auto max-w-sm">
        <img src={keySrc} alt="The Request 2 logo" className="mx-auto h-16 w-16 mb-6" />
        <h1 className="text-3xl font-black text-center mb-2">Reset your password</h1>
        <p className="text-sm text-center text-gray-700">
          We'll send a password reset link to the provided email address. Just click it and you're
          good to go!
        </p>
      </div>
      <Formik
        initialValues={{
          email: createShortTextValue(email),
        }}
        onSubmit={values => Api.post(`/send-password-reset-email/${values.email.content}`, {})}
      >
        <Form className="rounded-lg shadow-xs bg-white w-full px-6 py-6">
          <ShortText path="email" label="Email address associated with your account" />

          <Primary
            type="submit"
            title="Send recovery link"
            status="Normal"
            className="w-full mt-6"
          />
        </Form>
      </Formik>
    </div>
  );
}
