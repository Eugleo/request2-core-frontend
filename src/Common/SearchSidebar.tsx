import React from 'react';

export default function SearchSidebar() {
  return (
    <div className="bg-teal-600 sticky h-screen flex flex-col col-span-1 py-4 border-r border-gray-300">
      <h2
        style={{ fontVariant: 'small-caps' }}
        className="text-gray-700 font-medium text-sm mb-6 px-6"
      >
        search & filters
      </h2>
      <SearchField />
      <Filter title="Activity" choices={['Active', 'Inactive']} />
    </div>
  );
}

function SearchField() {
  return (
    <div className="px-6 mb-6">
      <input
        type="text"
        className="bg-gray-200 rounded-lg placeholder-gray-500 px-3 py-2 focus:outline-none"
        placeholder="Search"
      />
    </div>
  );
}

function Filter({ title, choices }: { title: string; choices: Array<string> }) {
  return (
    <div className="px-6">
      <h2 className="font-medium text-gray-500 mb-3">{title}</h2>
      {choices.map(ch => (
        <div key={ch} className="mb-1">
          <input id={ch} name={ch} type="checkbox" className="mr-2" />
          <label htmlFor={ch} className="text-gray-700">
            {ch}
          </label>
        </div>
      ))}
    </div>
  );
}
