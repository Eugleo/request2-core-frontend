import c from 'classnames';
import React from 'react';
import { Navigate } from 'react-router';

import { Card } from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { makeFieldPath, parseFieldName } from '../Utils/FieldPath';
import { isFileProperty } from '../Utils/File';
import { WithID } from '../Utils/WithID';
import { FilesView } from './FileView';
import { DetailProperty, Property, Request } from './Request';
import { resolveInclude } from './RequestDetailForm';
import { requestSchemas } from './RequestTypes';

export default function RequestDetails({ requestId }: { requestId: number }) {
  const { Loader } = useAsyncGet<WithID<DetailProperty>[]>(`/requests/${requestId}/props/details`);
  const { Loader: RequestLoader } = useAsyncGet<WithID<Request>>(`/requests/${requestId}`);

  // TODO Is there a better way?

  return (
    <RequestLoader>
      {request => {
        const schema = requestSchemas.get(request.requestType);

        if (!schema) {
          // TODO Handle this better
          console.log(`Can't find schema for the provided request type: ${request.requestType}`);
          return <Navigate to="/404" />;
        }

        return (
          <Loader>
            {details => {
              const relevantProperties = details.filter(p => p.active);
              const sections: Array<{
                title: string;
                properties: WithID<Property>[];
              }> = schema.sections
                .map(s => {
                  const fields = s.fields.mapMaybe(f => resolveInclude(f));
                  const normalProps = fields
                    .filter(f => f.type !== 'files')
                    .map(f => ({ ...f, fieldPath: makeFieldPath(s.title, f.name) }))
                    .mapMaybe(f => relevantProperties.find(p => p.propertyName === f.fieldPath))
                    .filter(p => p.propertyData !== '');
                  const fileProps = fields
                    .filter(f => f.type === 'files')
                    .map(f => ({ ...f, fieldPath: makeFieldPath(s.title, f.name) }))
                    .flatMap(f =>
                      relevantProperties.filter(p => p.propertyName.startsWith(f.fieldPath))
                    )
                    .filter(p => p.propertyData !== '');
                  return {
                    title: s.title,
                    properties: [...normalProps, ...fileProps],
                  };
                })
                .filter(s => s.properties.length > 0);

              return (
                <div>
                  {sections.map(s => (
                    <Card className="mb-4" key={s.title}>
                      <Section title={s.title} properties={s.properties} />
                    </Card>
                  ))}
                </div>
              );
            }}
          </Loader>
        );
      }}
    </RequestLoader>
  );
}

function Section({ title, properties }: { title: string; properties: WithID<Property>[] }) {
  const files = properties.filter(isFileProperty);
  return (
    <div>
      <div className={c('px-6 py-6 flex items-center border-gray-300')}>
        <h2 className="text-lg font-medium text-black">{title}</h2>
      </div>
      <dl style={{ gridAutoRows: 'minmax(1fr, auto)' }} className="border-gray-300">
        {properties
          .filter(p => !isFileProperty(p))
          .map((p, ix) => (
            <PropertyView
              name={parseFieldName(p.propertyName).field}
              propertyData={p.propertyData}
              isEven={ix % 2 === 0}
              key={p._id}
            />
          ))}
        {files.length > 0 ? <FilesView files={files} isEven={properties.length % 2 === 0} /> : null}
      </dl>
    </div>
  );
}

function PropertyView({
  name,
  propertyData,
  isEven,
}: {
  name: string;
  propertyData: Property['propertyData'];
  isEven: boolean;
}) {
  return (
    <div
      style={{ gridTemplateColumns: '1fr 2fr' }}
      className={c('gap-10 py-4 px-6 grid grid-cols-2', isEven ? 'bg-gray-100' : 'bg-white')}
    >
      <dt className="text-sm font-medium text-gray-600 flex-grow leading-5">{name}</dt>
      {propertyData.includes(';;;') ? (
        <dd className="flex flex-row flex-wrap">
          {propertyData
            .split(';;;')
            .map(txt => (
              <span key={txt} className="text-sm leading-5">
                {txt}
              </span>
            ))
            .intersperse(ix => (
              <span key={ix} className="text-sm text-gray-500 px-4">
                /
              </span>
            ))}
        </dd>
      ) : (
        <dd className="break-words text-sm">{propertyData}</dd>
      )}
    </div>
  );
}
