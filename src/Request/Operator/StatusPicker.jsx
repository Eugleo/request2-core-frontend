import React, { useState, useEffect } from 'react';
import { useField } from 'formik';
import c from 'classnames';

function StatusButton({ title, className = '', onClick, active = false, activeCl }) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      setTimeout(() => setClicked(false), 1000);
    }
  });

  const realOnClick = clicked
    ? () => {
        setClicked(false);
        onClick();
      }
    : () => setClicked(true);
  return (
    <button
      type="button"
      className={c(
        'rounded-full w-full py-2 box-border text-sm',
        className,
        active && activeCl,
        !active &&
          'border border-gray-200 bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500'
      )}
      disabled={active}
      onClick={realOnClick}
    >
      {clicked ? 'Confirm' : title}
    </button>
  );
}

export default function StatusPicker() {
  const [field, , meta] = useField({ name: 'status' });

  return (
    <div className="flex flex-col items-stretch w-32">
      <StatusButton
        title="Pending"
        active={field.value === 'Pending'}
        className="mb-2 "
        activeCl="bg-blue-100 text-blue-400 border border-blue-300"
        onClick={() => meta.setValue('Pending')}
      />
      <StatusButton
        title="In progress"
        active={field.value === 'In progress'}
        className="mb-2 "
        activeCl="bg-yellow-100 text-yellow-600 border border-yellow-300"
        onClick={() => meta.setValue('In progress')}
      />
      <StatusButton
        title="Done"
        active={field.value === 'Done'}
        className="mb-10"
        activeCl="bg-green-100 text-green-400 border border-green-300"
        onClick={() => meta.setValue('Done')}
      />
      <StatusButton
        title="Awaiting input"
        active={field.value === 'Awaiting input'}
        activeCl="bg-red-100 text-red-400 border border-red-300"
        onClick={() => meta.setValue('Awaiting input')}
      />
    </div>
  );
}
