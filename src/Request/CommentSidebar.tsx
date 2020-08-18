import c from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useRef } from 'react';

import * as Button from '../Common/Buttons';
import { RandomAvatar } from '../Page/UserView';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { comparator } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { Property } from './Request';

export default function CommentSidebar({ requestId }: { requestId: number }) {
  const { auth } = useAuth();
  const { data, error, pending, refresh } = useAsyncGet<WithID<Property>[]>(
    `/requests/${requestId}/comments`
  );
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => messageEndRef?.current?.scrollIntoView({ behavior: 'smooth' }), [data]);

  console.log('load');
  console.log({ data, error, pending, refresh });

  if (error) {
    return <div>Encountered an error when fetching comments</div>;
  }

  if (pending || !data) {
    return <div>Loading comments</div>;
  }

  return (
    <div
      style={{ gridTemplateRows: '1fr auto' }}
      className="bg-white border-l border-gray-300 relative grid grid-rows-2 max-h-full overflow-auto"
    >
      <div className="p-6 flex flex-col overflow-scroll">
        {data.sort(comparator(p => p.dateAdded)).map(prop => (
          <Comment isMine={prop.authorId === auth.userId} text={prop.propertyData} key={prop._id} />
        ))}
        <div ref={messageEndRef} />
      </div>
      <CommentComposer requestId={requestId} refresh={refresh} />
    </div>
  );
}

const textFieldClasses = [
  'w-full',
  'mb-3',
  'border',
  'shadow-sm',
  'text-sm',
  'border-gray-300',
  'text-gray-900',
  'rounded-md',
  'py-1',
  'px-2',
  'focus:outline-none',
  'focus:shadow-outline-blue',
  'focus:border-blue-600',
  'focus:z-10',
  'font-normal',
];

function CommentComposer({ requestId, refresh }: { requestId: number; refresh: () => void }) {
  const { auth, authPost } = useAuth<Property>();

  return (
    <Formik
      initialValues={{ comment: '' }}
      onSubmit={({ comment }) =>
        authPost(`/requests/${requestId}/comments`, {
          authorId: auth.userId,
          requestId,
          propertyType: 'Comment',
          propertyName: 'comment',
          propertyData: comment,
          dateAdded: Math.round(Date.now() / 1000),
          active: true,
        }).then(r => {
          if (r.status === 201) {
            refresh();
          }
        })
      }
    >
      <Form className="px-6 py-3 border-t border-gray-300 shadow-md">
        <Field
          name="comment"
          as="textarea"
          placeholder="Enter your comment here..."
          className={c(textFieldClasses, 'h-20')}
        />
        <div className="flex flex-row-reverse">
          <Button.Primary type="submit">Post comment</Button.Primary>
        </div>
      </Form>
    </Formik>
  );
}

function Comment({ isMine, text }: { isMine: boolean; text: string }) {
  const avatar = (
    <div className="flex flex-col items-stretch col-span-1 justify-start h-full">
      <RandomAvatar />
    </div>
  );

  const body = (
    <p
      className={c(
        'col-span-4 bg-gray-100 text-sm tet-gray-700 rounded-lg border-gray-200 border p-3 mb-6',
        isMine ? 'text-left mr-6' : 'text-right ml-6'
      )}
    >
      {text}
    </p>
  );

  return (
    <div className={c('grid grid-cols-5 gap-2 max-w-sm w-full')}>
      {isMine ? [avatar, body] : [body, avatar]}
    </div>
  );
}
