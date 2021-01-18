import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { Primary } from '../../Common/Buttons';
import { ShortTextInput } from '../../Common/Form/NewTextField';
import { Question, reqRule } from '../../Common/Form/Question';
import * as Api from '../../Utils/Api';
import keySrc from '../../assets/key.png';
import { CenteredForm, CenteredPage } from './CenteredPage';

export function PasswordResetInitPageWithEmail(): JSX.Element {
  const { email } = useParams();
  return <PasswordResetInitPage email={email} />;
}

export function PasswordResetInitPage({ email }: { email?: string | undefined }): JSX.Element {
  const { errors, register, handleSubmit } = useForm<{ email: string }>({
    defaultValues: { email },
  });
  return (
    <CenteredPage
      title="Reset your password"
      subtitle="We'll send you a password reset link, just click it and you're good to go!"
      imageSrc={keySrc}
      imageAlt="A key logo"
    >
      <form
        onSubmit={handleSubmit(values => Api.post(`/password-reset-init`, { email: values.email }))}
      >
        <CenteredForm>
          <div>
            <Question>Email address associated with your account</Question>
            <ShortTextInput name="email" errors={errors} ref={register(reqRule())} />
          </div>
          <Primary
            type="submit"
            title="Send recovery link"
            status="Normal"
            className="w-full mt-6"
          />
        </CenteredForm>
      </form>
    </CenteredPage>
  );
}

export function PasswordResetPage(): JSX.Element {
  const { email, token } = useParams();
  const { errors, register, handleSubmit, watch } = useForm<{
    password: string;
    passwordCheck: string;
  }>({
    defaultValues: { password: '', passwordCheck: '' },
  });

  const pwd = watch('pwd');

  return (
    <CenteredPage
      title="Pick a new password"
      subtitle="Now just enter the new pasword and you're set!"
      imageSrc={keySrc}
      imageAlt="A key logo"
    >
      <form
        onSubmit={handleSubmit(values =>
          Api.post(`/password-reset`, { email, password: values.password, token })
        )}
      >
        <CenteredForm>
          <div>
            <Question>Please enter your new password</Question>
            <ShortTextInput
              name="password"
              type="password"
              errors={errors}
              ref={register({
                ...reqRule(),
                validate: val =>
                  val.length > 8 || 'The password needs to have at least 8 characters',
              })}
            />
          </div>
          <div>
            <Question>Please repeat the password</Question>
            <ShortTextInput
              name="passwordCheck"
              type="password"
              errors={errors}
              ref={register({
                ...reqRule(),
                validate: val => val === pwd || "The passwords don't match",
              })}
            />
          </div>
          <Primary type="submit" title="Set new password" status="Normal" className="w-full mt-6" />
        </CenteredForm>
      </form>
    </CenteredPage>
  );
}
