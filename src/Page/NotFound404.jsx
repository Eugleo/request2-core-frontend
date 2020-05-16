import React from 'react';
import { CenteredPage } from './Page';

export default function NotFound404() {
  return (
    <CenteredPage title="Page not found">
      <div className="text-center text-gray-700">
        We're sorry, we couldn't find the page you requested.
      </div>
    </CenteredPage>
  );
}
