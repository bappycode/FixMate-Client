"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatPrice } from "@/lib/format";
import type { ChartPoint } from "@/lib/chart-data";

type BarChartCardProps = {
  valueName: string;
  data: ChartPoint[];
  unit?: "count" | "money";
};

const formatValue = (value: number, unit: "count" | "money") => (unit === "money" ? formatPrice(value) : String(value));

export function BarChartCard({ valueName, data, unit = "count" }: BarChartCardProps) {
  const config = { value: { label: valueName, color: "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <>
      <ChartContainer config={config} className="h-64 w-full" aria-hidden>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={0} fontSize={12} />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={unit === "money" ? 56 : 32}
            fontSize={12}
            tickFormatter={(value: number) => formatValue(value, unit)}
          />
          <ChartTooltip cursor={{ fill: "var(--tint)" }} content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ChartContainer>

      <table className="sr-only">
        <caption>{valueName}</caption>
        <thead>
          <tr>
            <th scope="col">Group</th>
            <th scope="col">{valueName}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{formatValue(point.value, unit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
