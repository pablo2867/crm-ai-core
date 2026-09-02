"use client";

import CountUp from "react-countup";

export default function AnimatedCounter({
  value,
}: {
  value: number;
}) {

  return (
    <CountUp
      end={value}
      duration={1.2}
    />
  );
}