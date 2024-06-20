import {
  BarChart as BarChartRecharts,
  Bar,
  LineChart as LineChartRecharts,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { BarChartProps, LineChartProps } from "@/interfaces/Chart.interface";

export const BarChart = (props: BarChartProps) => {
  const { data, countName } = props;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartRecharts
        data={data}
        margin={{
          top: 40,
          right: 5,
          left: -22,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="countData"
          name={countName}
          // fill={}
          radius={[10, 10, 0, 0]}
          barSize={30}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChartRecharts>
    </ResponsiveContainer>
  );
};

export const LineChart = (props: LineChartProps) => {
  const { data, width, height } = props;
  // console.log(data)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChartRecharts
        width={600}
        height={300}
        data={data}
        margin={{
          top: 40,
          right: 5,
          left: -22,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />

        {data.map((entry, index) => {
          const dataKey = Object.keys(entry)[index + 1];
          return (
            <Line
              key={`${dataKey}_${index}`}
              connectNulls
              type="monotone"
              dataKey={dataKey}
              name=""
              stroke={`var(--play-color-${index % 4 !== 0 ? index % 4 : 2})`}
              // fill="#000"
              // dot={{
              //   r: 5,
              //   strokeWidth: 3,
              //   stroke: "#fff",
              //   fill: "#000",
              // }}
              activeDot={{
                r: 6,
                strokeWidth: 5,
                stroke: `var(--play-color-${index % 4 !== 0 ? index % 4 : 2})`,
              }}
              strokeWidth={3}
            ></Line>
          );
        })}
      </LineChartRecharts>
    </ResponsiveContainer>
  );
};
