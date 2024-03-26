import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.jsx";
import { IoIosStats } from "react-icons/io";

export default function StatCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm">Total revenue</span>
          <span>
            <IoIosStats />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>$45,231.89</CardTitle>
        <CardDescription>+20.1% from last month</CardDescription>
      </CardContent>
    </Card>
  );
}
