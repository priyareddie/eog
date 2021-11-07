import { ApolloProvider, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core';
import React from 'react';
import Select from 'react-select';
import client from '../../graphql';
import { metricQuery } from '../../graphql/query';

const styles = makeStyles({
  multiselect: {
    margin: 20,
  },
});

export const ChartScreen: React.FC = () => {
  const classes = styles();
  const [options, setOptions] = React.useState([]);
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const { data } = useQuery(metricQuery);

  React.useEffect(() => {
    setOptions(data.getMetrics.map((op: string) => ({
      label: op,
      value: op,
    })));
  }, [data]);

  const handleSelectChange = React.useCallback((val) => {
    setSelectedOptions(val);
  }, [selectedOptions]);

  return (
    <div>
      <Select
        className={classes.multiselect}
        isMulti
        value={selectedOptions}
        options={options}
        onChange={handleSelectChange}
      />
    </div>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <ChartScreen />
  </ApolloProvider>
);
