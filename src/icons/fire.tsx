import { SVGProps, forwardRef } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export const FireIcon = forwardRef<SVGSVGElement, Props>(
  ({ size = 24, width, height, ...props }, ref) => (
    <svg
      role="presentation"
      aria-hidden="true"
      focusable="false"
      height={size || height}
      width={size || width}
      viewBox="0 0 256 256"
      {...props}
      ref={ref}
    >
      <path
        fill="currentColor"
        d="M143.38 17.85a8 8 0 0 0-12.63 3.41l-22 60.41l-24.16-23.41a8 8 0 0 0-11.93.89C51 87.53 40 116.08 40 144a88 88 0 0 0 176 0c0-59.45-50.79-108-72.62-126.15"
      />
    </svg>
  ),
);

FireIcon.displayName = "FireIcon";
