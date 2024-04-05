import { SVGProps, forwardRef } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export const XIcon = forwardRef<SVGSVGElement, Props>(
  ({ size = 24, width, height, ...props }, ref) => (
    <svg
      role="presentation"
      aria-hidden="true"
      focusable="false"
      height={size || height}
      width={size || width}
      viewBox="0 0 48 48"
      {...props}
      ref={ref}
    >
      <defs>
        <mask id="IconifyId18e88346f467bc4829">
          <g
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          >
            <circle cx="24" cy="24" r="20" fill="#fff" stroke="#fff" />
            <path stroke="#000" d="M33 15L15 33m0-18l18 18" />
          </g>
        </mask>
      </defs>
      <path
        fill="currentColor"
        d="M0 0h48v48H0z"
        mask="url(#IconifyId18e88346f467bc4829)"
      />
    </svg>
  ),
);

XIcon.displayName = "XIcon";
