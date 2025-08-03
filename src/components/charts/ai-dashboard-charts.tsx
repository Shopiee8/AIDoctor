import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string | Date;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  title: string;
  height?: number;
  color?: string;
  showValues?: boolean;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  title,
  height = 200,
  color = '#3B82F6',
  showValues = false
}) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              {showValues && (
                <div className="text-xs text-muted-foreground">{item.value}</div>
              )}
              <div 
                className="rounded-t w-full min-h-[20px] transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${(item.value / maxValue) * (height - 60)}px`,
                  backgroundColor: item.color || color
                }}
                title={`${item.label}: ${item.value}`}
              ></div>
              <div className="text-xs font-medium text-center">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface LineChartProps {
  data: TimeSeriesData[];
  title: string;
  height?: number;
  color?: string;
  showDots?: boolean;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 200,
  color = '#10B981',
  showDots = true
}) => {
  if (!data || data.length < 2) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: `${height}px` }}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
              className="transition-all duration-300"
            />
            {showDots && data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value - minValue) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={color}
                  className="hover:r-3 transition-all duration-200"
                >
                  <title>{`${item.timestamp}: ${item.value}`}</title>
                </circle>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
            {data.map((item, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DonutChartProps {
  data: ChartDataPoint[];
  title: string;
  size?: number;
  showLegend?: boolean;
}

export const SimpleDonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  size = 200,
  showLegend = true
}) => {
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;
  
  let cumulativePercentage = 0;
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.6;
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };
  
  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    const outerArc = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');
    
    const innerStart = polarToCartesian(size / 2, size / 2, innerRadius, endAngle);
    const innerEnd = polarToCartesian(size / 2, size / 2, innerRadius, startAngle);
    
    const innerArc = [
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 0, innerStart.x, innerStart.y,
    ].join(' ');
    
    return outerArc + innerArc + ' Z';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg width={size} height={size}>
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const startAngle = cumulativePercentage * 3.6;
                const endAngle = (cumulativePercentage + percentage) * 3.6;
                cumulativePercentage += percentage;
                
                return (
                  <path
                    key={index}
                    d={createArcPath(startAngle, endAngle)}
                    fill={item.color || `hsl(${index * 137.5}, 70%, 50%)`}
                    className="hover:opacity-80 transition-opacity duration-200"
                  >
                    <title>{`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}</title>
                  </path>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
          
          {showLegend && (
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color || `hsl(${index * 137.5}, 70%, 50%)` }}
                  ></div>
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'default' | 'green' | 'red' | 'blue' | 'yellow';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'default',
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50';
      case 'red':
        return 'text-red-600 bg-red-50';
      case 'blue':
        return 'text-blue-600 bg-blue-50';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className={`p-2 rounded-full ${getColorClasses(color)}`}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs ${getChangeColor(change)}`}>
            {change > 0 ? '+' : ''}
            {change.toFixed(1)}% {changeLabel || 'from last period'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showValue = true,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {(showValue || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && <span className="text-xl font-bold">{percentage.toFixed(0)}%</span>}
          {label && <span className="text-xs text-muted-foreground text-center">{label}</span>}
        </div>
      )}
    </div>
  );
};

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 30,
  color = '#3B82F6',
  showDots = false,
}) => {
  if (!data || data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        className="transition-all duration-300"
      />
      {showDots &&
        data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - min) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className="transition-all duration-200"
            />
          );
        })}
    </svg>
  );
};

export const ChartLoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-pulse space-y-4 w-full">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);
