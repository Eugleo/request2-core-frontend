import React, { useState } from 'react';
import c from 'classnames';

function statusStyle(status, hover = false) {
  switch (status) {
    case 'Pending':
      return hover
        ? 'hover:bg-blue-100 hover:text-blue-500'
        : 'bg-blue-100 text-blue-500 border border-blue-300 hover:border-blue-500';
    case 'In progress':
      return hover
        ? 'hover:bg-orange-100 hover:text-orange-600'
        : 'bg-orange-100 text-orange-600 border border-orange-300 hover:border-orange-500';
    case 'Done':
      return hover
        ? 'hover:bg-green-100 hover:text-green-500'
        : 'bg-green-100 text-green-500 border border-green-300 hover:border-green-500';
    default:
      return hover
        ? 'hover:bg-red-100 hover:text-red-400'
        : 'bg-red-100 text-red-400 border border-red-300 hover:border-red-500';
  }
}

function StatusButton({ title, onClick, active }) {
  return (
    <button
      type="button"
      disabled={active}
      className={c(
        'w-full py-3 px-8 box-border text-sm',
        active && 'text-gray-300 cursor-auto',
        !active && statusStyle(title, true)
      )}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default function StatusSelect() {
  const [hidden, setHidden] = useState(true);
  const [selected, setSelected] = useState('Pending');

  return (
    <div className="relative">
      <button
        type="button"
        className={c(
          'rounded-full text-sm py-1 pl-4 pr-3 block transition-all duration-75',
          statusStyle(selected)
        )}
        onClick={() => setHidden(h => !h)}
      >
        <div className="flex flex-row items-center">
          {selected}
          <div
            style={{ top: '1px' }}
            className={c('pointer-events-none relative ml-2 ', statusStyle(selected, true))}
          >
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </button>

      <div
        className={c(
          hidden && 'hidden',
          'absolute bg-white rounded-md shadow-lg w-48 mt-2 ml-4 border border-gray-200'
        )}
      >
        {['Pending', 'In progress', 'Done', 'Awaiting input'].map(title => (
          <StatusButton
            key={title}
            title={title}
            active={title === selected}
            onClick={() => {
              setHidden(true);
              setSelected(title);
            }}
          />
        ))}
      </div>
    </div>
  );
}
