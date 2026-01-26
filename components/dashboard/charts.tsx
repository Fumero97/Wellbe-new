"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData extends Record<string, string | number | undefined> {
  name?: string;
  subject?: string;
}

// Radar Chart Component
export function RadarChartDemo({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid className="stroke-slate-200" />
          <PolarAngleAxis dataKey="subject" className="text-xs font-medium text-slate-500" />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ChartRadarLinesOnly({ 
  data, 
  config 
}: { 
  data: any[], 
  config: ChartConfig 
}) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[400px] w-full"
    >
      <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarAngleAxis 
          dataKey="area" 
          tick={(props) => {
            const { payload, x, y, textAnchor } = props;
            const fullText = payload.value;
            const shortText = fullText.length > 15 ? fullText.substring(0, 12) + "..." : fullText;
            
            return (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={4}
                  textAnchor={textAnchor}
                  className="fill-slate-500 text-[10px] font-medium cursor-help"
                >
                  <tspan>{shortText}</tspan>
                  <title>{fullText}</title>
                </text>
              </g>
            );
          }}
        />
        <PolarGrid radialLines={false} />
        <PolarRadiusAxis domain={[0, 6]} axisLine={false} tick={false} />
        <Radar
          dataKey="score"
          stroke="var(--color-score)"
          fill="none"
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  )
}

// Area Chart Component (e.g., for trends)
export function AreaChartDemo({ data, dataKey, color = "#8884d8" }: { data: ChartData[], dataKey: string, color?: string }) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ stroke: '#cbd5e1' }}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={color} 
            fillOpacity={0.2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Simple Bar Chart
export function BarChartDemo({ data }: { data: ChartData[] }) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
           <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ChartLineMultiple({ 
  data, 
  config,
  dataKeys,
  domain = [3.8, 5.2] 
}: { 
  data: any[], 
  config: ChartConfig,
  dataKeys: string[],
  domain?: [number, number]
}) {
  return (
    <ChartContainer
      config={config}
      className="h-[350px] w-full"
    >
      <LineChart
        data={data}
        margin={{
          left: -20,
          right: 12,
          top: 20,
          bottom: 20
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
        />
        <YAxis 
          domain={domain}
          tickCount={8}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {dataKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={`var(--color-${key})`}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}
