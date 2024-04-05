import { SVGProps, forwardRef } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export const HomeIcon = forwardRef<SVGSVGElement, Props>(
  ({ size = 24, width, height, ...props }, ref) => (
    <svg
      role="presentation"
      aria-hidden="true"
      focusable="false"
      height={size || height}
      width={size || width}
      viewBox="0 0 14 14"
      {...props}
      ref={ref}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.707 1.293a1 1 0 0 0-1.414 0l-6 6a1 1 0 0 0 1.414 1.414L2 8.414V13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8.414l.293.293a1 1 0 1 0 1.414-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
);

HomeIcon.displayName = "HomeIcon";
