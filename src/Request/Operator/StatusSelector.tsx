import c from 'classnames';
import React, { useState } from 'react';

import { useOnClickOutside } from '../../Common/Hooks';
import { useAuth } from '../../Utils/Auth';
import { statusStyle, statusStyleHover, strToStatus } from '../Status';

// function StatusButton({ title, onClick, active }) {
//   return (
//     <button
//       type="button"
//       disabled={active}
//       className={c(
//         'w-full py-3 px-3 box-border text-xs',
//         active && 'text-gray-300 cursor-auto',
//         !active && statusStyleHover(title)
//       )}
//       onClick={onClick}
//     >
//       {title}
//     </button>
//   );
// }

// export function StatusSelect({ request }): JSX.Element {
//   const { auth, authPut } = useAuth();
//   const [hidden, setHidden] = useState(true);
//   const [selected, setSelected] = useState(strToStatus(request.status));
//   const ref = useOnClickOutside(() => setHidden(true));

//   return (
//     <div className="relative" ref={hidden ? null : ref}>
//       <button
//         type="button"
//         className={c(
//           'rounded-full text-xs py-1 pl-4 pr-3 block transition-all duration-75',
//           statusStyle(selected)
//         )}
//         onClick={() => setHidden(h => !h)}
//       >
//         <div className="flex flex-row items-center">
//           {selected}
//           <div
//             style={{ top: '1px' }}
//             className={c('pointer-events-none relative ml-2 ', statusStyleHover(selected))}
//           >
//             <svg
//               className="fill-current h-4 w-4"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 20 20"
//             >
//               <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//             </svg>
//           </div>
//         </div>
//       </button>

//       {!hidden && (
//         <div className="absolute bg-white rounded-md shadow-lg w-32 mt-2 ml-4 border border-gray-200">
//           {['Pending', 'In Progress', 'Done', 'Awaiting Input', 'Deleted'].map(title => (
//             <StatusButton
//               key={title}
//               title={title}
//               active={title === selected}
//               onClick={() => {
//                 setHidden(true);
//                 setSelected(title);
//                 authPut(`/requests/${request._id}`, {
//                   props: [
//                     {
//                       active: true,
//                       authorId: auth.user._id,
//                       dateAdded: Math.round(Date.now() / 1000),
//                       propertyData: strToStatus(title),
//                       propertyName: 'status',
//                       propertyType: 'General',
//                       requestId: request._id,
//                     },
//                   ],
//                   req: { ...request, status: strToStatus(title) },
//                 });
//               }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
