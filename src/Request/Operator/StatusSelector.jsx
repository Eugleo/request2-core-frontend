import React, { useState } from 'react';
import c from 'classnames';
import { statusStyle, statusStyleHover, statusFromString, statusToString } from '../Status';
import { useAuth } from '../../Utils/Auth';

function StatusButton({ title, onClick, active }) {
  return (
    <button
      type="button"
      disabled={active}
      className={c(
        'w-full py-3 px-8 box-border text-sm',
        active && 'text-gray-300 cursor-auto',
        !active && statusStyleHover(title)
      )}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default function StatusSelect({ request }) {
  const { auth, authPut } = useAuth();
  const [hidden, setHidden] = useState(true);
  const [selected, setSelected] = useState(statusToString(request.status));

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
            className={c('pointer-events-none relative ml-2 ', statusStyleHover(selected))}
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
        {['Pending', 'In Progress', 'Done', 'Awaiting Input', 'Deleted'].map(title => (
          <StatusButton
            key={title}
            title={title}
            active={title === selected}
            onClick={() => {
              setHidden(true);
              setSelected(title);
              authPut(`/requests/${request._id}`, {
                req: { ...request, status: statusFromString(title) },
                props: [
                  {
                    requestId: request._id,
                    authorId: auth.userId,
                    propertyPath: 'operator:request-description/status',
                    propertyData: statusFromString(title),
                    dateAdded: Math.round(Date.now() / 1000),
                    active: true,
                  },
                ],
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
