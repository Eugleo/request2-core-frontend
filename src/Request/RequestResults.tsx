import Uploady from '@rpldy/uploady';
import c from 'classnames';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import * as Button from '../Common/Buttons';
import { Files } from '../Common/Form/NewFile';
import { Form, SubmitFunction } from '../Common/Form/NewForm';
import { LongText, ShortText } from '../Common/Form/NewTextField';
import { FieldContext } from '../Common/Form/Question';
import { Card, Spacer } from '../Common/Layout';
import { useAsyncGet } from '../Utils/Api';
import { apiBase } from '../Utils/ApiBase';
import { Authorized, useAuth } from '../Utils/Auth';
import { capitalize } from '../Utils/Func';
import { WithID } from '../Utils/WithID';
import { fieldToProperty, FieldValue, getDefaultValues } from './FieldValue';
import { New, Property, PropertyJSON } from './Request';

type FormValues = { Title: string; TeamId: string } & Record<string, FieldValue>;

function numFromString(str: string, def = 0) {
  const n = Number.parseInt(str);
  return Number.isNaN(n) ? def : n;
}

function getTotalTime(human: string, machine: string) {
  return numFromString(human) + numFromString(machine);
}

export function RequestResults({ requestId }: { requestId: number }): JSX.Element {
  const { result, refresh } = useAsyncGet<WithID<PropertyJSON>[]>(`/requests/${requestId}/props`);
  const results = result.status === 'Success' ? getDefaultValues(result.data) : {};
  const form = useForm({ defaultValues: results });
  const { authPut } = useAuth<{ properties: New<Property>[] }>();
  const [state, setState] = useState<'show' | 'edit'>('show');

  if (state === 'edit') {
    const totalTime = getTotalTime(
      form.watch('Human Time') ?? results['Human Time'],
      form.watch('Machine Time') ?? results['Machine Time']
    );
    return (
      <Uploady destination={{ url: `${apiBase}/files` }}>
        <FormProvider {...form}>
          <FieldContext.Provider value={{ state, values: results }}>
            <Card className="overflow-hidden">
              <form
                onSubmit={form.handleSubmit(async values => {
                  const properties = Object.entries(values).reduce(fieldToProperty, []);
                  const r = await authPut(`/requests/${requestId}/results`, { properties });

                  if (r.ok) {
                    refresh();
                    setState('show');
                  }
                })}
              >
                <div className="p-6 space-y-6">
                  <Files q="Result files" id="Result Files" />
                  <LongText q="Result description" id="Result Description" />
                  <div>
                    <div className="flex flex-row space-x-6 mb-3">
                      <ShortText q="Human time" id="Human Time" />
                      <ShortText q="Machine time" id="Machine Time" />
                    </div>
                    <p className="text-sm text-gray-400">
                      The total time is {totalTime} {totalTime === 1 ? 'minute' : 'minutes'}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <Button.Tertiary
                    onClick={() => {
                      setState('show');
                    }}
                  >
                    Cancel
                  </Button.Tertiary>
                  <Button.Primary type="submit">Submit results</Button.Primary>
                </div>
              </form>
            </Card>
          </FieldContext.Provider>
        </FormProvider>
      </Uploady>
    );
  }
  const totalTime = getTotalTime(results['Human Time'], results['Machine Time']);
  return (
    <FieldContext.Provider value={{ state, values: results }}>
      <Card className="overflow-hidden">
        <form>
          <div className="p-6 space-y-6">
            <Files q="Result files" id="Result Files" />
            <LongText q="Result description" id="Result Description" />
            <div>
              <div className="flex flex-row space-x-6 mb-3">
                <ShortText q="Human time" id="Human Time" />
                <ShortText q="Machine time" id="Machine Time" />
              </div>
              <p className="text-sm text-gray-400">
                The total time is {totalTime} {totalTime === 1 ? 'minute' : 'minutes'}
              </p>
            </div>
          </div>
          <Authorized roles={['Admin', 'Operator']}>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <Button.Secondary
                onClick={() => {
                  setState('edit');
                }}
              >
                Edit
              </Button.Secondary>
            </div>
          </Authorized>
        </form>
      </Card>
    </FieldContext.Provider>
  );
}
