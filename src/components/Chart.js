"use client";
import { AreaChart } from "@tremor/react";
import { Card } from "./ui/card";

const chartdata = [
  { date: "Jan 22", SemiAnalysis: 2890, "The Pragmatic Engineer": 2338 },
  { date: "Feb 22", SemiAnalysis: 2756, "The Pragmatic Engineer": 2103 },
  { date: "Mar 22", SemiAnalysis: 3322, "The Pragmatic Engineer": 2194 },
  { date: "Apr 22", SemiAnalysis: 3470, "The Pragmatic Engineer": 2108 },
  { date: "May 22", SemiAnalysis: 3475, "The Pragmatic Engineer": 1812 },
  { date: "Jun 22", SemiAnalysis: 3129, "The Pragmatic Engineer": 1726 },
  { date: "Jul 22", SemiAnalysis: 3490, "The Pragmatic Engineer": 1982 },
  { date: "Aug 22", SemiAnalysis: 2903, "The Pragmatic Engineer": 2012 },
  { date: "Sep 22", SemiAnalysis: 2643, "The Pragmatic Engineer": 2342 },
  { date: "Oct 22", SemiAnalysis: 2837, "The Pragmatic Engineer": 2473 },
  { date: "Nov 22", SemiAnalysis: 2954, "The Pragmatic Engineer": 3848 },
  { date: "Dec 22", SemiAnalysis: 3239, "The Pragmatic Engineer": 3736 },
];

export default function Chart() {
  return (
    <Card>
      <div className="p-8">
        <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Total Requests
        </span>
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          6,568
        </p>
        <div>
          <AreaChart
            className="h-80"
            data={chartdata}
            index="date"
            categories={["SemiAnalysis", "The Pragmatic Engineer"]}
            colors={["primary", "red"]}
            yAxisWidth={33}
            // stack
          />
        </div>
      </div>
    </Card>
  );
}
