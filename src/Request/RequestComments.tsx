import c from 'classnames';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as Button from '../Common/Buttons';
import { LongTextInput } from '../Common/Form/NewTextField';
import { RandomAvatar } from '../Page/UserView';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { comparing } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { Comment, New } from './Request';

export function RequestComments({ requestId }: { requestId: number }): JSX.Element {
  const { auth } = useAuth();

  const { Loader, refresh: refreshComments } = useAsyncGet<WithID<Comment>[]>(
    `/requests/${requestId}/comments`
  );

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef?.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return (
    <div
      style={{ gridTemplateRows: '1fr auto' }}
      className="bg-white border-l border-gray-300 relative grid grid-rows-2 max-h-full overflow-auto"
    >
      <div className="p-6 flex flex-col overflow-scroll">
        <Loader>
          {comments => (
            <>
              {comments.sort(comparing(c => c.dateAdded)).map(prop => (
                <CommentComponent
                  isMine={prop.authorId === auth.user._id}
                  text={prop.content}
                  key={prop._id}
                />
              ))}
              <div className="pt-4 flex-shrink-0" ref={messageEndRef} />
            </>
          )}
        </Loader>
      </div>
      <CommentComposer requestId={requestId} refresh={refreshComments} />
    </div>
  );
}

function CommentComposer({ requestId, refresh }: { requestId: number; refresh: () => void }) {
  const { authPost } = useAuth<New<Comment>>();
  const form = useForm<{ comment: string }>();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(async ({ comment }) => {
          const r = await authPost(`/requests/${requestId}/comments`, { content: comment });

          if (r.status === 201) {
            refresh();
            form.reset();
          }
        })}
        className="px-6 py-3 border-t border-gray-300 shadow-md"
      >
        <LongTextInput
          name="comment"
          placeholder="Enter your comment here..."
          errors={form.errors}
          ref={form.register({ required: 'You have to enter something to submit it' })}
        />
        <div className="flex flex-row-reverse">
          <Button.Primary type="submit">Post comment</Button.Primary>
        </div>
      </form>
    </FormProvider>
  );
}

function CommentComponent({ isMine, text }: { isMine: boolean; text: string }) {
  function Avatar() {
    return (
      <div className="flex flex-col items-stretch col-span-1 justify-start h-full">
        <RandomAvatar />
      </div>
    );
  }

  function Body() {
    return (
      <p
        className={c(
          'col-span-4 bg-gray-100 text-sm tet-gray-700 rounded-md border-gray-200 border p-3',
          isMine ? 'text-left' : 'text-right'
        )}
      >
        {text}
      </p>
    );
  }

  return (
    <div className={c('grid grid-cols-5 gap-2 max-w-sm w-full')}>
      {isMine ? (
        <>
          <Avatar />
          <Body />
        </>
      ) : (
        <>
          <Body />
          <Avatar />
        </>
      )}
    </div>
  );
}
