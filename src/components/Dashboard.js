"use client";
import StatCard from "@/components/cards/stat-card";
import Chart from "@/components/Chart";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, ind) => (
          <StatCard key={ind} />
        ))}
      </div>
      <div>
        <Chart />
      </div>
    </div>
  );
}
