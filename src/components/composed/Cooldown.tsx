"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "../ui/progress";

export default function Cooldown({
  endsOn,
}: {
  readonly endsOn: string | null;
}) {
  // the endsOn starts at 7 days from cooldown start
  const daysRemaining = endsOn
    ? Math.ceil(
        (new Date(endsOn).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;
  const percentComplete =
    ((7 - daysRemaining) / 7) * 100 >= 0
      ? ((7 - daysRemaining) / 7) * 100
      : 100;
  return (
    <Card className="w-full max-w-96 py-[19px] shadow-md">
      {endsOn ? (
        <>
          <CardHeader className="pb-2">
            <CardDescription>Cooldown ends in</CardDescription>
            <CardTitle className="text-4xl">
              {daysRemaining >= 0 ? daysRemaining : 0} days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {7 - daysRemaining <= 7 ? 7 - daysRemaining : 7}/7 day(s)
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={percentComplete} aria-label="12% increase" />
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="pb-2">
            <CardDescription>Start the cooldown</CardDescription>
            <CardTitle className="text-4xl">n/a</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">0/7 day(s)</div>
          </CardContent>
          <CardFooter>
            <Progress value={percentComplete} aria-label="12% increase" />
          </CardFooter>
        </>
      )}
    </Card>
  );
}
