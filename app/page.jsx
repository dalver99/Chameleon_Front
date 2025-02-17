'use client'

import { Section1, Section2, Section3, Section4 } from "@/components/landing/sections";

export default function Page() {

  return (
    <div className="overflow-x-hidden">
      <div className="w-full flex flex-col gap-28 md:gap-48">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
      </div>
    </div>
  );
};