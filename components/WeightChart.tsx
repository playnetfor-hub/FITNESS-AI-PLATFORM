import React from 'react';
import type { ProgressEntry } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface WeightChartProps {
  data: ProgressEntry[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const { t, theme } = useAppContext();
  
  if (data.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-500">
        <p>{t.weightChartMessage}</p>
      </div>
    );
  }

  const svgWidth = 500;
  const svgHeight = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 35 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const dates = data.map(d => new Date(d.date).getTime());
  const weights = data.map(d => d.weight);

  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  
  const weightRange = maxWeight - minWeight;
  const paddedMinWeight = weightRange > 0 ? minWeight - weightRange * 0.2 : minWeight - 2;
  const paddedMaxWeight = weightRange > 0 ? maxWeight + weightRange * 0.2 : maxWeight + 2;


  const getX = (date: number) => {
    if (maxDate === minDate) return margin.left;
    return margin.left + ((date - minDate) / (maxDate - minDate)) * width;
  };

  const getY = (weight: number) => {
    if (paddedMaxWeight === paddedMinWeight) return margin.top + height / 2;
    return margin.top + height - ((weight - paddedMinWeight) / (paddedMaxWeight - paddedMinWeight)) * height;
  };
  
  const linePath = data
    .map(d => `${getX(new Date(d.date).getTime())},${getY(d.weight)}`)
    .join(' L ');

  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];
  const areaPath = `M ${getX(new Date(firstPoint.date).getTime())},${getY(firstPoint.weight)} L ${linePath} L ${getX(new Date(lastPoint.date).getTime())},${height + margin.top} L ${getX(new Date(firstPoint.date).getTime())},${height + margin.top} Z`;

  const gridLines = 5;
  const gridLineValues = Array.from({ length: gridLines }, (_, i) => {
    return paddedMinWeight + (i * (paddedMaxWeight - paddedMinWeight)) / (gridLines - 1);
  });

  const areaStopColor = theme === 'dark' ? '#2DD4BF' : '#06B6D4';
  const lineStopColor1 = theme === 'dark' ? '#4FD1C5' : '#0891B2';
  const lineStopColor2 = theme === 'dark' ? '#38B2AC' : '#0E7490';
  const gridStrokeColor = theme === 'dark' ? '#4A5568' : '#E2E8F0';
  const textColor = theme === 'dark' ? '#A0AEC0' : '#718096';
  const pointFillColor = theme === 'dark' ? '#2DD4BF' : '#06B6D4';
  const pointStrokeColor = theme === 'dark' ? '#1A202C' : '#F7FAFC';


  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
        <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={areaStopColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={areaStopColor} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={lineStopColor1} />
                <stop offset="100%" stopColor={lineStopColor2} />
            </linearGradient>
        </defs>

      {/* Grid lines */}
      {gridLineValues.map((value, i) => (
        <g key={i}>
          <line
            x1={margin.left}
            x2={width + margin.left}
            y1={getY(value)}
            y2={getY(value)}
            stroke={gridStrokeColor}
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
          <text
            x={margin.left - 7}
            y={getY(value) + 3}
            fill={textColor}
            textAnchor="end"
            fontSize="10"
          >
            {value.toFixed(1)}
          </text>
        </g>
      ))}

      {/* X Axis */}
       <text
            x={margin.left}
            y={svgHeight - 8}
            fill={textColor}
            textAnchor="start"
            fontSize="10"
        >
            {new Date(minDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
        </text>
        <text
            x={width + margin.left}
            y={svgHeight - 8}
            fill={textColor}
            textAnchor="end"
            fontSize="10"
        >
            {new Date(maxDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
        </text>
      
      {/* Area Gradient */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* Line */}
      <path d={`M ${linePath}`} fill="none" stroke="url(#lineGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Points */}
      {data.map((d, i) => (
        <g key={i}>
            <circle
            cx={getX(new Date(d.date).getTime())}
            cy={getY(d.weight)}
            r="6"
            fill={pointFillColor}
            fillOpacity="0.2"
            />
            <circle
            cx={getX(new Date(d.date).getTime())}
            cy={getY(d.weight)}
            r="3"
            fill={pointFillColor}
            stroke={pointStrokeColor}
            strokeWidth="1"
            >
            <title>{`${t.date}: ${d.date}, ${t.weightLabel}: ${d.weight}kg`}</title>
            </circle>
        </g>
      ))}
    </svg>
  );
};

export default WeightChart;