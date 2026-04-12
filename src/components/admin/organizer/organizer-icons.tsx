import type { ReactNode, SVGProps } from "react";

function Ico(props: SVGProps<SVGSVGElement> & { children: ReactNode }) {
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

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Ico>
  );
}

export function IconBell(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Ico>
  );
}

export function IconSettings(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Ico>
  );
}

export function IconDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </Ico>
  );
}

export function IconEvent(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </Ico>
  );
}

export function IconGroups(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Ico>
  );
}

export function IconCountertops(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M3 10h18" />
      <path d="M5 6h14" />
      <path d="M5 14h14" />
      <path d="M3 18h18" />
    </Ico>
  );
}

export function IconAnalytics(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </Ico>
  );
}

export function IconPersonAdd(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </Ico>
  );
}

export function IconHelp(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </Ico>
  );
}

export function IconFilterList(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </Ico>
  );
}

export function IconAdd(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Ico>
  );
}

export function IconTrendingUp(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </Ico>
  );
}

export function IconTimer(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </Ico>
  );
}

export function IconCheckCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </Ico>
  );
}

export function IconCalendar(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </Ico>
  );
}

export function IconPerson(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Ico>
  );
}

export function IconLocation(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Ico>
  );
}

export function IconUpload(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </Ico>
  );
}

export function IconBarChart(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </Ico>
  );
}

export function IconChevronsDown(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="m7 6 5 5 5-5" />
      <path d="m7 13 5 5 5-5" />
    </Ico>
  );
}

export function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Ico>
  );
}

export function IconEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </Ico>
  );
}

export function IconBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <Ico {...props}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    </Ico>
  );
}
