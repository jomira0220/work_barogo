export interface BarChartProps {
  data: {
    name: string;
    countData: number;
    color: string;
  }[];
  countName: string;
}

export interface LineChartProps {
  data: {
    name: number;
    [key: string]: number;
  }[];
  width?: number;
  height?: number;
}
