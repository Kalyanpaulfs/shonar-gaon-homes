import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Forward ref so parent can attach it
export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, className, id }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn("py-16 px-4 md:px-6 lg:px-8", className)}
      >
        <div className="container max-w-7xl mx-auto">{children}</div>
      </section>
    );
  }
);

Section.displayName = "Section";
