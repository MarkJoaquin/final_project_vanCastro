import type { SectionProps } from "@/types/section";
import "./Section.css";

export default function Section({ className, children }: SectionProps) {
  return (
    <>
      <section className={className + " section-padding"}>
        {children}
      </section>
    </>
  );
}
