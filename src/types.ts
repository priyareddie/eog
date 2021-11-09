export type Instrument = {
  metric: string;
  measurements: Array<Measurement>;
};

export type Measurement = {
  at: number;
  value: number;
  metric: string;
  unit: string;
};
