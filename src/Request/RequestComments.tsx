import c from 'classnames';
import { randomInt } from 'crypto';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import * as Button from '../Common/Buttons';
import { LongTextInput } from '../Common/Form/NewTextField';
import { Card } from '../Common/Layout';
import { RandomAvatar } from '../Page/UserView';
import { UserDetails } from '../User/User';
import { LinkToProfile } from '../User/UserProfile';
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

  // useEffect(() => {
  //   if (messageEndRef?.current) {
  //     messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // });

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-2 border-b border-gray-100 flex flex-row items-center">
        <h2 className="text-lg font-semibold">Comments</h2>
      </div>
      <div
        style={{ gridTemplateRows: '1fr auto' }}
        className="shadow-sm relative grid grid-rows-2 overflow-auto"
      >
        <div className="overflow-scroll">
          <Loader>
            {comments =>
              comments.length > 0 ? (
                <div>
                  <div className="p-6 space-y-6">
                    {comments.sort(comparing(c => c.dateAdded)).map(prop => (
                      <CommentComponent
                        authorId={prop.authorId}
                        text={prop.content}
                        key={prop._id}
                      />
                    ))}
                  </div>
                  <div className="h-0.5 bg-gray-100" />
                </div>
              ) : (
                <>{null}</>
              )
            }
          </Loader>
        </div>
        <CommentComposer requestId={requestId} refresh={refreshComments} />
      </div>
    </Card>
  );
}

function CommentComposer({ requestId, refresh }: { requestId: number; refresh: () => void }) {
  const { authPost } = useAuth<New<Comment>>();
  const form = useForm<{ comment: string }>();

  return (
    <form
      onSubmit={form.handleSubmit(async ({ comment }) => {
        const r = await authPost(`/requests/${requestId}/comments`, { content: comment });

        if (r.status === 201) {
          refresh();
          form.reset();
        }
      })}
    >
      <div className="p-6">
        <LongTextInput
          name="comment"
          placeholder="Enter your comment here..."
          errors={form.errors}
          reg={form.register({ required: 'You have to enter something to submit it' })}
        />
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse">
        <Button.Primary type="submit">Post comment</Button.Primary>
      </div>
    </form>
  );
}

function CommentComponent({ authorId, text }: { authorId: number; text: string }) {
  const { Loader, result } = useAsyncGet<UserDetails>(`/users/${authorId}/profile`);
  const { auth } = useAuth();
  const isMine = Math.random() < 0.5; // auth.user._id === authorId;

  function Avatar() {
    return (
      <Loader>
        {author => (
          <div className="flex-shrink-0">
            <Link
              to={`/users/${authorId}/profile`}
              className={c(
                'inline-block rounded-full border border-pink-100 hover:border-purple-300'
              )}
            >
              <RandomAvatar userEmail={author.email} size="2.25rem" border={false} />
            </Link>
          </div>
        )}
      </Loader>
    );
  }

  function Body() {
    return (
      <div className="px-4 py-3 bg-gray-100 rounded-md">
        <p className={c('text-sm text-gray-700')}>{text}</p>
      </div>
    );
  }

  return (
    <div>
      <div className={c('flex gap-2', isMine ? 'flex-row' : 'flex-row-reverse')}>
        <Avatar />
        <Body />
        <div className="w-24 flex-shrink-0" />
      </div>
    </div>
  );
}
