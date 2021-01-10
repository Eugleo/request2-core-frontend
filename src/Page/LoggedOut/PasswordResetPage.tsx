import { Form, Formik } from 'formik';
import { useParams } from 'react-router';

import { Primary } from '../../Common/Buttons';
import { ShortText } from '../../Common/Form/TextField';
import { createShortTextValue } from '../../Request/FieldValue';
import { value } from '../../Request/FormConstruction/FormConstruction';
import * as Api from '../../Utils/Api';
import keySrc from '../../assets/key.png';
import { CenteredForm, CenteredPage } from './CenteredPage';

export function PasswordResetInitPageWithEmail(): JSX.Element {
  const { email } = useParams();
  return <PasswordResetInitPage email={email} />;
}

export function PasswordResetInitPage({ email }: { email: string | null }): JSX.Element {
  return (
    <CenteredPage
      title="Reset your password"
      subtitle="We'll send you a password reset link, just click it and you're good to go!"
      imageSrc={keySrc}
      imageAlt="A key logo"
    >
      <Formik
        initialValues={{
          email: createShortTextValue(email),
        }}
        onSubmit={values => Api.post(`/password-reset-init`, { email: values.email.content })}
      >
        <CenteredForm>
          <ShortText path="email" label="Email address associated with your account" />
          <Primary
            type="submit"
            title="Send recovery link"
            status="Normal"
            className="w-full mt-6"
          />
        </CenteredForm>
      </Formik>
    </CenteredPage>
  );
}

export function PasswordResetPage(): JSX.Element {
  const { email, token } = useParams();

  return (
    <CenteredPage
      title="Pick a new password"
      subtitle="Now just enter the new pasword and you're set!"
      imageSrc={keySrc}
      imageAlt="A key logo"
    >
      <Formik
        initialValues={{
          password: createShortTextValue(),
          passwordCheck: createShortTextValue(),
        }}
        onSubmit={values =>
          Api.post(`/password-reset`, { email, password: values.password.content, token })
        }
      >
        <CenteredForm>
          <ShortText path="password" type="password" label="Password" />
          <ShortText path="passwordCheck" type="password" label="Password (again)" />
          <Primary type="submit" title="Set new password" status="Normal" className="w-full mt-6" />
        </CenteredForm>
      </Formik>
    </CenteredPage>
  );
}
