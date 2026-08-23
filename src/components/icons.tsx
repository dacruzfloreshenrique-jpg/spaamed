import type { ReactNode } from "react";

function I({ children, className = "w-5 h-5", filled = false }: { children: ReactNode; className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type P = { className?: string };

export const IcSpark = ({ className }: P) => (
  <I className={className} filled><path d="M12 2.5l2.1 6.2 6.4.4-5.1 3.9 1.9 6.3L12 15.6l-5.3 3.7 1.9-6.3-5.1-3.9 6.4-.4L12 2.5z" /></I>
);
export const IcSparkles = ({ className }: P) => (
  <I className={className}><path d="M12 4l1.6 4.2L18 9.8l-4.4 1.6L12 15.6l-1.6-4.2L6 9.8l4.4-1.6L12 4z" /><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" /><path d="M5 3.5l.7 1.8 1.8.7-1.8.7L5 8.5l-.7-1.8-1.8-.7 1.8-.7L5 3.5z" /></I>
);
export const IcHome = ({ className }: P) => (
  <I className={className}><path d="M4 11.2L12 4l8 7.2" /><path d="M6 9.8V20h12V9.8" /><path d="M10 20v-5.4h4V20" /></I>
);
export const IcCalendar = ({ className }: P) => (
  <I className={className}><rect x="4" y="5.5" width="16" height="15" rx="2.5" /><path d="M4 10h16M8.5 3.5v3.4M15.5 3.5v3.4" /></I>
);
export const IcCalendarPlus = ({ className }: P) => (
  <I className={className}><rect x="4" y="5.5" width="16" height="15" rx="2.5" /><path d="M4 10h16M8.5 3.5v3.4M15.5 3.5v3.4M12 13v4M10 15h4" /></I>
);
export const IcTicket = ({ className }: P) => (
  <I className={className}><path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v1.5a2.5 2.5 0 000 5V16a2 2 0 01-2 2H6a2 2 0 01-2-2v-1.5a2.5 2.5 0 000-5V8z" /><path d="M14 6v2.2M14 11v2M14 15.8V18" /></I>
);
export const IcGift = ({ className }: P) => (
  <I className={className}><rect x="4" y="9.5" width="16" height="11" rx="2" /><path d="M4 13.5h16M12 9.5V20.5M12 9.5s-4.5.3-5.5-2C5.8 5.9 7.4 4 9 4.6c1.9.7 3 4.9 3 4.9zM12 9.5s4.5.3 5.5-2c.7-1.6-.9-3.5-2.5-2.9-1.9.7-3 4.9-3 4.9z" /></I>
);
export const IcUser = ({ className }: P) => (
  <I className={className}><circle cx="12" cy="8" r="3.6" /><path d="M4.8 20c1.1-3.5 3.9-5.2 7.2-5.2s6.1 1.7 7.2 5.2" /></I>
);
export const IcUsers = ({ className }: P) => (
  <I className={className}><circle cx="9" cy="8.5" r="3.2" /><path d="M3.2 19.5c.9-3 3.2-4.6 5.8-4.6s4.9 1.6 5.8 4.6" /><path d="M15.5 5.6a3.2 3.2 0 010 5.9M17.8 15.3c1.6.7 2.7 2.1 3.2 4.2" /></I>
);
export const IcBell = ({ className }: P) => (
  <I className={className}><path d="M6 16v-5.5a6 6 0 1112 0V16l1.5 2.5h-15L6 16z" /><path d="M10 20.5a2.2 2.2 0 004 0" /></I>
);
export const IcStar = ({ className, half }: P & { half?: boolean }) => (
  <I className={className} filled={!half}><path d="M12 3.4l2.5 5.4 5.9.6-4.4 4 1.2 5.8L12 16.3l-5.2 2.9 1.2-5.8-4.4-4 5.9-.6L12 3.4z" /></I>
);
export const IcChart = ({ className }: P) => (
  <I className={className}><path d="M4 4v16h16" /><path d="M7.5 15.5c2.5 0 2.5-6 5-6s2.5 4 5-2.5" /></I>
);
export const IcBars = ({ className }: P) => (
  <I className={className}><path d="M5 20V12M10 20V6M15 20V10M20 20v-6" /></I>
);
export const IcPie = ({ className }: P) => (
  <I className={className}><path d="M12 3a9 9 0 109 9h-9V3z" /><path d="M14.5 2.5A9 9 0 0121.5 9.5h-7v-7z" /></I>
);
export const IcArrowR = ({ className }: P) => (
  <I className={className}><path d="M4 12h16M14 6l6 6-6 6" /></I>
);
export const IcArrowL = ({ className }: P) => (
  <I className={className}><path d="M20 12H4M10 6l-6 6 6 6" /></I>
);
export const IcCheck = ({ className }: P) => (
  <I className={className}><path d="M4.5 12.5l5 5L19.5 6.5" /></I>
);
export const IcX = ({ className }: P) => (
  <I className={className}><path d="M6 6l12 12M18 6L6 18" /></I>
);
export const IcClock = ({ className }: P) => (
  <I className={className}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2.5" /></I>
);
export const IcPin = ({ className }: P) => (
  <I className={className}><path d="M12 21s-7-6.1-7-11a7 7 0 0114 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></I>
);
export const IcPhone = ({ className }: P) => (
  <I className={className}><path d="M5.5 4h3.6l1.4 4.2-2.2 1.6a12.6 12.6 0 005.9 5.9l1.6-2.2L20 14.9v3.6a1.9 1.9 0 01-2 1.9A16.4 16.4 0 013.6 6a1.9 1.9 0 011.9-2z" /></I>
);
export const IcMail = ({ className }: P) => (
  <I className={className}><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7.5l7.5 6 7.5-6" /></I>
);
export const IcCopy = ({ className }: P) => (
  <I className={className}><rect x="8.5" y="8.5" width="12" height="12" rx="2.5" /><path d="M15.5 5.5v-1a2 2 0 00-2-2h-9a2 2 0 00-2 2v9a2 2 0 002 2h1" transform="translate(1 1)" /></I>
);
export const IcChevR = ({ className }: P) => (
  <I className={className}><path d="M9 5l7 7-7 7" /></I>
);
export const IcChevL = ({ className }: P) => (
  <I className={className}><path d="M15 5l-7 7 7 7" /></I>
);
export const IcSend = ({ className }: P) => (
  <I className={className}><path d="M20.5 3.5L3.5 10l6.5 2.5L12.5 19l8-15.5z" /><path d="M10 12.5l4.5-4.5" /></I>
);
export const IcMegaphone = ({ className }: P) => (
  <I className={className}><path d="M4 10v4a1.5 1.5 0 001.5 1.5H8l10 4.5V4L8 8.5H5.5A1.5 1.5 0 004 10z" /><path d="M8 15.5v3.2a1.8 1.8 0 003.6 0v-1.8M18 9.5a3 3 0 010 5" /></I>
);
export const IcRefresh = ({ className }: P) => (
  <I className={className}><path d="M4.5 12a7.5 7.5 0 0113-5.1L20 9.5" /><path d="M20 4.5v5h-5" /><path d="M19.5 12a7.5 7.5 0 01-13 5.1L4 14.5" /><path d="M4 19.5v-5h5" /></I>
);
export const IcWallet = ({ className }: P) => (
  <I className={className}><path d="M4 7.5A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v9a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 16.5v-9z" /><path d="M15 12.5h5v3h-5a1.5 1.5 0 010-3z" /></I>
);
export const IcCard = ({ className }: P) => (
  <I className={className}><rect x="3.5" y="6" width="17" height="13" rx="2.5" /><path d="M3.5 10.5h17M7 15.5h4" /></I>
);
export const IcSearch = ({ className }: P) => (
  <I className={className}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></I>
);
export const IcMenu = ({ className }: P) => (
  <I className={className}><path d="M4 7h16M4 12h16M4 17h10" /></I>
);
export const IcInfo = ({ className }: P) => (
  <I className={className}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.8v.4" /></I>
);
export const IcHeart = ({ className }: P) => (
  <I className={className}><path d="M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.6 4.5 6.8 4.5c2 0 3.7 1.1 5.2 3 1.5-1.9 3.2-3 5.2-3 3.2 0 5.3 3.1 4.1 6.3C19.5 15.4 12 20 12 20z" /></I>
);
export const IcGear = ({ className }: P) => (
  <I className={className}><circle cx="12" cy="12" r="3.2" /><path d="M12 3.5l1.2 2.6 2.8-.7 1 2.7 2.9.5-.6 2.8 2.2 1.9-1.8 2.3.9 2.7-2.8.9-.3 2.9-2.9-.2-1.6 2.4-2.4-1.5-2.5 1.4-1.5-2.5-2.9.1-.4-2.9-2.8-1 1-2.7-1.9-2.2 2.2-1.9-.6-2.8 2.9-.5 1-2.7 2.8.8L12 3.5z" /></I>
);
export const IcSliders = ({ className }: P) => (
  <I className={className}><path d="M5 4v6M5 14v6M12 4v2M12 10v10M19 4v10M19 18v2" /><circle cx="5" cy="12" r="2" /><circle cx="12" cy="8" r="2" /><circle cx="19" cy="16" r="2" /></I>
);
export const IcTrend = ({ className }: P) => (
  <I className={className}><path d="M3.5 17.5l5-5 3.5 3.5 7.5-8" /><path d="M15 8h4.5v4.5" /></I>
);
export const IcPlus = ({ className }: P) => (
  <I className={className}><path d="M12 5v14M5 12h14" /></I>
);
export const IcEye = ({ className }: P) => (
  <I className={className}><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" /><circle cx="12" cy="12" r="2.8" /></I>
);
export const IcDownload = ({ className }: P) => (
  <I className={className}><path d="M12 4v11M7.5 11l4.5 4.5L16.5 11" /><path d="M5 19.5h14" /></I>
);
export const IcShield = ({ className }: P) => (
  <I className={className}><path d="M12 3l7.5 3v5.5c0 4.6-3.2 7.7-7.5 9.5-4.3-1.8-7.5-4.9-7.5-9.5V6L12 3z" /><path d="M8.8 12l2.2 2.2 4.2-4.4" /></I>
);
export const IcFilter = ({ className }: P) => (
  <I className={className}><path d="M4 6h16M7 12h10M10 18h4" /></I>
);
export const IcSun = ({ className }: P) => (
  <I className={className}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></I>
);
export const IcMessage = ({ className }: P) => (
  <I className={className}><path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H10l-4.5 3.5v-3.5h-.5A2.5 2.5 0 014 14.5v-8z" /><path d="M8 9h8M8 12h5" /></I>
);
export const IcLogo = ({ className }: P) => (
  <I className={className} filled>
    <path d="M12 2.8l1.8 5.3 5.6.5-4.4 3.5 1.5 5.5L12 14.4l-4.5 3.2 1.5-5.5-4.4-3.5 5.6-.5L12 2.8z" />
    <path d="M19.3 16.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" />
  </I>
);
