import c from 'classnames';
import { Field, Form, Formik } from 'formik';
import React from 'react';

import * as Button from '../Common/Buttons';
import { RandomAvatar } from '../Page/UserView';
import { useAuth } from '../Utils/Auth';

export default function CommentSidebar({ requestId }: { requestId: number }) {
  return (
    <div
      style={{ gridTemplateRows: '1fr auto' }}
      className="bg-white border-l border-gray-300 relative grid grid-rows-2 max-h-full overflow-auto"
    >
      <div className="p-6 flex flex-col overflow-scroll">
        {[...Array(20).keys()].map(n => (
          <Comment index={n} />
        ))}
      </div>
      <CommentComposer requestId={requestId} />
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

function CommentComposer({ requestId }: { requestId: number }) {
  const { auth, authPut } = useAuth();

  return (
    <Formik initialValues={{ comment: '' }} onSubmit={console.log}>
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

function Comment({ index }: { index: number }) {
  const avatar = (
    <div className="flex flex-col items-stretch col-span-1 justify-start h-full">
      <RandomAvatar />
    </div>
  );

  const text = (
    <p
      className={c(
        'col-span-4 bg-gray-100 text-sm tet-gray-700 rounded-lg border-gray-200 border p-3 mb-6',
        index % 2 === 0 ? 'text-left mr-6' : 'text-right ml-6'
      )}
    >
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
      Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus
      mus. Donec quam felis.
    </p>
  );

  return (
    <div className={c('grid grid-cols-5 gap-2 max-w-sm w-full')}>
      {index % 2 === 0 ? [avatar, text] : [text, avatar]}
    </div>
  );
}
