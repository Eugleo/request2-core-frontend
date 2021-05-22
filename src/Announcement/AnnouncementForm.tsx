import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { LongTextInput, ShortTextInput } from '../Common/Form/NewTextField';
import { Question, reqRule } from '../Common/Form/Question';
import { Card, Page } from '../Common/Layout';
import { Markdown } from '../Common/MdRender';
import { Announcement } from './Announcement';

type AnnStub = { title: string; body: string };

// TODO Handle failure
export function AnnouncementForm({
  title,
  ann,
  onSubmit,
  children,
}: {
  title: string;
  ann?: Announcement;
  onSubmit: (values: AnnStub) => Promise<Response>;
  children: ReactNode;
}): JSX.Element {
  const navigate = useNavigate();
  const { register, errors, handleSubmit, watch } = useForm({
    defaultValues: { title: ann?.title ?? '', body: ann?.body ?? '' },
  });
  const body = watch('body');
  return (
    <Page title={title}>
      <div className="grid grid-cols-2 gap-10">
        <Card className="overflow-hidden max-screen relative">
          <div className="h-full">
            <form
              onSubmit={handleSubmit(async values => {
                await onSubmit(values);
                navigate(-1);
              })}
              className="h-full"
            >
              <div className="p-6 space-y-6 w-full flex flex-col h-full">
                <div>
                  <Question required>The title of the announcement</Question>
                  <ShortTextInput name="title" reg={register(reqRule())} errors={errors} />
                </div>
                <div className="flex flex-col h-full">
                  <Question required>The announcement itself</Question>
                  <div className="h-full w-full">
                    <LongTextInput
                      name="body"
                      reg={register(reqRule())}
                      className="font-mono h-full"
                      errors={errors}
                      placeholder="The first paragraph will serve as a preview in the list of Announcements..."
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="flex justify-end w-full px-6 py-3 bg-gray-50">{children}</div>
          </div>
        </Card>
        <div>
          <span className="text-sm text-gray-600 mb-1">Preview</span>
          <Markdown
            source={body}
            className="border border-gray-300 rounded-sm pb-4 pt-6 px-6 mb-6"
          />
        </div>
      </div>
    </Page>
  );
}
