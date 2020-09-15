import React from 'react';

import { ContentWrapper } from '../Common/Layout';

export function NotFound404(): JSX.Element {
  return (
    <ContentWrapper>
      <div className="text-center text-gray-700">
        We're sorry, we couldn't find the page you requested.
      </div>
    </ContentWrapper>
  );
}
