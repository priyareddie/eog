import { makeStyles } from '@material-ui/core';
import React from 'react';

interface Props {
  label: string;
  value: string;
  color: string
}

const styles = makeStyles({
  container: {
    padding: 8,
    background: 'white',
    border: '1px solid white',
    marginRight: 8,
  },
});

const ValueCard: React.FC<Props> = ({
  label, value, color,
}: Props) => {
  const classes = styles();
  return (
    <div style={{ borderColor: color }} className={classes.container}>
      {label} - {value}
    </div>
  );
};

export default React.memo(ValueCard);
