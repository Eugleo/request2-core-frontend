import c from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useRef } from 'react';

import * as Button from '../Common/Buttons';
import { RandomAvatar } from '../Page/UserView';
import { useAsyncGet } from '../Utils/Api';
import { useAuth } from '../Utils/Auth';
import { parseFieldName } from '../Utils/FieldPath';
import { comparator } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { DetailProperty, Property } from './Request';

export default function CommentSidebar({
  requestId,
  details,
}: {
  requestId: number;
  details: WithID<DetailProperty>[];
}) {
  const { auth } = useAuth();
  const { data, error, pending, refresh } = useAsyncGet<
    WithID<Property & { propertyType: 'Comment' }>[]
  >(`/requests/${requestId}/comments`);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => messageEndRef?.current?.scrollIntoView({ behavior: 'smooth' }), [data]);

  if (error) {
    return <div>Encountered an error when fetching comments</div>;
  }

  if (pending || !data) {
    return <div>Loading comments</div>;
  }

  const sortedProps = details.sort(comparator(p => p.dateAdded));
  const updatedProps = sortedProps
    .filter(p => !p.active)
    .mapMaybe(p =>
      sortedProps.find(q => p.propertyName === q.propertyName && q.dateAdded > p.dateAdded)
    );

  return (
    <div
      style={{ gridTemplateRows: '1fr auto' }}
      className="bg-white border-l border-gray-300 relative grid grid-rows-2 max-h-full overflow-auto"
    >
      <div className="p-6 flex flex-col overflow-scroll">
        {[...updatedProps, ...data]
          .sort(comparator(p => p.dateAdded))
          .map(prop =>
            prop.propertyType === 'Detail' ? (
              <Change
                key={prop._id}
                date={prop.dateAdded}
                authorName="Evžen"
                fieldPath={prop.propertyName}
              />
            ) : (
              <Comment
                isMine={prop.authorId === auth.userId}
                text={prop.propertyData}
                key={prop._id}
              />
            )
          )
          .intersperse(ix => (
            <div
              key={ix}
              style={{ width: '1px', margin: '-1px auto -1px auto' }}
              className="h-4 bg-gray-200 flex-shrink-0"
            />
          ))}
        <div className="pt-4 flex-shrink-0" ref={messageEndRef} />
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
  const Avatar = () => (
    <div className="flex flex-col items-stretch col-span-1 justify-start h-full">
      <RandomAvatar />
    </div>
  );

  const Body = () => (
    <p
      className={c(
        'col-span-4 bg-gray-100 text-sm tet-gray-700 rounded-lg border-gray-200 border p-3',
        isMine ? 'text-left' : 'text-right'
      )}
    >
      {text}
    </p>
  );

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

function Change({
  date,
  authorName,
  fieldPath,
}: {
  date: number;
  authorName: string;
  fieldPath: string;
}) {
  const { field } = parseFieldName(fieldPath);
  return (
    <div className="text-xs text-gray-400 border-t border-b border-gray-200 w-full p-3 hover:text-gray-600">
      <p className="text-center w-full">
        <span className="font-semibold">{authorName}</span> changed {field}
      </p>
    </div>
  );
}
