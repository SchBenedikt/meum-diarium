import type { SVGProps } from "react";

export function LaurelWreathIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.29 21.32a4.5 4.5 0 0 0 7.42 0" />
      <path d="M3 10.96A9 9 0 0 1 12 3a9 9 0 0 1 9 7.96" />
      <path d="M12 21.32V3" />
      <path d="M7 16a5 5 0 0 0-5-5" />
      <path d="M17 16a5 5 0 0 1 5-5" />
    </svg>
  );
}
