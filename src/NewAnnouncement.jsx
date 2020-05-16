import React, { useState } from 'react';

import { Redirect } from 'react-router-dom';
import * as Button from './Buttons';

import { useAuth } from './Auth';

import Page from './Page';
import MdRender from './MdRender';

// TODO Fields shouldn't be empty (Formik?)
export default function NewAnnouncement() {
  const { authPost, auth } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  if (shouldRedirect) {
    return <Redirect to="/announcements" />;
  }

  return (
    <Page title="New announcement" width="max-w-2xl">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 mb-1">Title</span>
        <input
          className="resize-y p-2 border rounded focus:outline-none focus:shadow-outline mb-4"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <span className="text-sm text-gray-600 mb-1">Body</span>
        <textarea
          className="resize-y font-mono text-sm p-4 border rounded focus:outline-none focus:shadow-outline mb-4 h-48"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <span className="text-sm text-gray-600 mb-1">Preview</span>
        <MdRender source={body} className="border border-gray-300 rounded-sm pb-4 pt-6 px-6 mb-6" />
        <div className="flex mb-4">
          <Button.Primary
            title="Create new announcement"
            onClick={() => {
              // TODO Handle failure
              authPost('/announcements', {
                title,
                body,
                authorId: auth.userId,
                dateCreated: Math.floor(Date.now() / 1000),
                active: true,
              }).then(() => setShouldRedirect(true));
            }}
          />
          <span className="flex-grow" />
          <Button.Normal
            title="Cancel"
            className="bg-white"
            onClick={() => setShouldRedirect(true)}
          />
        </div>
      </div>
    </Page>
  );
}
