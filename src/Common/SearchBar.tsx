import c from 'classnames';
import React from 'react';
import { Search } from 'react-feather';
import { useForm } from 'react-hook-form';

import { Secondary } from './Buttons';
import { baseClasses, normalClasses, ShortTextInput } from './Form/NewTextField';

export function SearchBar({
  query,
  onSubmit,
}: {
  query: string;
  onSubmit: ({ query }: { query: string }) => void;
}): JSX.Element {
  const { handleSubmit, register } = useForm({ defaultValues: { query } });
  return (
    <form className="mr-4 w-full relative" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row items-stretch w-full justify-between space-x-4">
        <div className="flex-grow">
          <ShortTextInput
            name="query"
            ref={register}
            className={c(baseClasses, 'pl-8', normalClasses)}
          />
          <Search
            style={{
              height: '1rem',
              left: '10px',
              top: '11px',
              width: '1rem',
            }}
            className="absolute text-gray-600 pointer-events-none"
          />
        </div>
        <Secondary className="flex-shrink-0 bg-white" type="submit" title="Search" />
      </div>
    </form>
  );
}
