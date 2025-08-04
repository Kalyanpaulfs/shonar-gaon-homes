import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 px-4 md:px-6 lg:px-8",
        className
      )}
    >
      <div className="container max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}