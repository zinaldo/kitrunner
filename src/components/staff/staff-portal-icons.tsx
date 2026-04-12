import type { SVGProps } from "react";

function Ico(props: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  const { children, className, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconRocket(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </Ico>
  );
}

export function IconRun(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <circle cx="12" cy="5" r="2" />
      <path d="M10 22v-6M14 22v-6M8 10h8l-2 6M10 10 8 22M14 10l2 12" />
    </Ico>
  );
}

export function IconLandscape(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M3 20h18" />
      <path d="m6 20 4-10 4 6 4-12 5 16" />
    </Ico>
  );
}

export function IconArrowForward(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Ico>
  );
}
