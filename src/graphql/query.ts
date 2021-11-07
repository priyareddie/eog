import { gql } from '@apollo/client';

export const metricQuery = gql`
  query {
    getMetrics
  }
`;

export const multipleMeasurementsQuery = gql`
  query ($metrics: [MeasurementQuery]) {
    getMultipleMeasurements(input: $metrics) {
      metric
      measurements {
        value
        at
      }
    }
  }
`;

export const newMeasurementQuery = gql`
  subscription {
    newMeasurement {
      metric
      value
      at
    }
  }
`;
