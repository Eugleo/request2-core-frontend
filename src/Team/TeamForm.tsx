import React, { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ShortTextInput } from '../Common/Form/NewTextField';
import { Question } from '../Common/Form/Question';
import { Card, Page } from '../Common/Layout';
import { Maybe } from '../Utils/Maybe';
import { Team } from './Team';

type TeamStub = { name: string; code: string };

function validate(values: TeamStub) {
  const error: { name?: string; code?: string } = {};

  if (!values.name) {
    error.name = 'This field is required';
  }

  if (!values.code) {
    error.code = 'This field is required';
  }

  return error;
}

export function TeamForm({
  title,
  team,
  onSubmit,
  children,
  headerButtons,
}: {
  title: string;
  team?: Maybe<Team>;
  onSubmit: (values: TeamStub) => Promise<Response>;
  children: ReactNode;
  headerButtons?: React.ReactNode;
}): JSX.Element {
  const navigate = useNavigate();
  const { register, errors, handleSubmit } = useForm<TeamStub>({
    defaultValues: {
      name: team?.name ?? '',
      code: team?.code ?? '',
    },
  });

  return (
    <Page title={title} buttons={headerButtons}>
      <Card className="max-w-md w-full mx-auto">
        <form
          className="flex flex-col items-start"
          onSubmit={handleSubmit(async values => {
            await onSubmit(values);
            navigate(-1);
          })}
        >
          <div className="px-6 mt-4 mb-8 w-full">
            <div>
              <Question>Team leader</Question>
              <ShortTextInput name="name" />
            </div>
            <div>
              <Question>Institutional code</Question>
              <ShortTextInput name="code" />
            </div>
          </div>
          <div className="flex justify-end w-full px-6 py-3 bg-gray-100">{children}</div>
        </form>
      </Card>
    </Page>
  );
}
