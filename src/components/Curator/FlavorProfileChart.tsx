'use client';

import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { HydratedDiaryEntry } from '@/types';

interface FlavorProfileChartProps {
  entries: HydratedDiaryEntry[];
}

export function FlavorProfileChart({ entries }: FlavorProfileChartProps) {
  const chartData = useMemo(() => {
    const weights: Record<string, number> = {};

    entries.forEach((entry) => {
      const tags = entry.cocktail.flavor_tags;
      if (!tags || tags.length === 0) return;

      let weight = 0;
      if (entry.rating === 5) weight = 5;
      else if (entry.rating === 4) weight = 3;
      else if (entry.rating === 3) weight = 1;
      else weight = 0; // 1 or 2 stars

      if (weight > 0) {
        tags.forEach((tag) => {
          const label = tag.label;
          if (label) {
            weights[label] = (weights[label] || 0) + weight;
          }
        });
      }
    });

    const data = Object.keys(weights).map((tag) => ({
      subject: tag,
      weight: weights[tag],
    }));

    return data.sort((a, b) => b.weight - a.weight);
  }, [entries]);

  if (chartData.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-stone-800/60 rounded-lg bg-stone-900/20">
        <p className="text-sm font-sans text-stone-500 italic tracking-wide">
          Not enough flavor data yet. Keep tasting!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 sm:h-96 bg-stone-900/10 rounded-xl border border-stone-800/50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#44403c" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#a8a29e', fontSize: 12, fontFamily: 'serif' }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
          <Radar
            name="Flavor Profile"
            dataKey="weight"
            stroke="#d4af37"
            fill="#d4af37"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
