import { ApolloProvider, useQuery } from '@apollo/client';
import { CircularProgress, makeStyles } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import client from '../graphql';
import { multipleMeasurementsQuery, newMeasurementQuery } from '../graphql/query';
import { Instrument, Measurement } from '../types';
import ValueCard from './ValueCard';

interface Props {
  instruments: string[];
}

const lineColor: Record<string, string> = {
  oilTemp: '#e74c3c',
  waterTemp: '#1bd377',
  injValveOpen: '#c71ca9',
  flareTemp: '#ff9a00',
  tubingPressure: '#2684ff',
  casingPressure: '#01feff',
};

const styles = makeStyles({
  alignCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  realtimeValues: {
    display: 'flex',
    margin: '8px 20px',
  },
});

const MeasurementChart: React.FC<Props> = ({ instruments }: Props) => {
  const [selections, setSelections] = React.useState([]);
  const classes = styles();

  React.useEffect(() => {
    const after = new Date().valueOf() - 600000;
    const data = instruments.map((instrument) => ({
      metricName: instrument,
      after,
    }));
    setSelections(data as any);
  }, [instruments]);

  const { data, loading, subscribeToMore } = useQuery(
    multipleMeasurementsQuery,
    { variables: { instruments: selections } },
  );

  React.useEffect(() => {
    subscribeToMore({
      document: newMeasurementQuery,
      updateQuery: (originalData, { subscriptionData: { data: d } }) => {
        if (!d || !originalData?.getMultipleMeasurements?.length) return originalData;
        const { newMeasurement } = d;

        const getMultipleMeasurements = originalData.getMultipleMeasurements
          .reduce((array: Instrument[], instrument: Instrument) => {
            if (newMeasurement.metric === instrument.metric) {
              return array.concat({
                ...instrument,
                measurements: [...instrument.measurements, newMeasurement],
              });
            }
            return array.concat(instrument);
          }, []);
        return { getMultipleMeasurements };
      },
    });
  }, [subscribeToMore]);

  if (!instruments.length) return <div className={classes.alignCenter}>No Instrument Selected</div>;

  if (loading) return <div className={classes.alignCenter}><CircularProgress /></div>;

  const getMultipleMeasurements = data?.getMultipleMeasurements;

  const chartData = {
    labels: getMultipleMeasurements[0]?.measurements.map((measurement: Measurement) => moment(measurement.at).format('HH:mm')),
    datasets: getMultipleMeasurements?.map((instrument: Instrument) => ({
      label: instrument.metric,
      data: instrument.measurements.map(({ value }: Measurement) => value),
      borderColor: lineColor[instrument.metric],
      borderWidth: 1,
    })),
  };

  return (
    <div>
      <div className={classes.realtimeValues}>
        {getMultipleMeasurements?.map((instrument: Instrument) => (
          <ValueCard
            label={instrument.metric}
            color={lineColor[instrument.metric]}
            value={(instrument.measurements as any).at(-1).value}
          />
        ))}
      </div>
      <LineChart
        height={500}
        width={1000}
        data={chartData}
        options={{
          elements: {
            point: {
              radius: 0,
            },
          },
        }}
      />
    </div>

  );
};

export default (props: Props) => (
  <ApolloProvider client={client}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <MeasurementChart {...props} />
  </ApolloProvider>
);
