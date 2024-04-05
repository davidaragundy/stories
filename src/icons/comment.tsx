import { SVGProps, forwardRef } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export const CommentIcon = forwardRef<SVGSVGElement, Props>(
  ({ size = 24, width, height, ...props }, ref) => (
    <svg
      role="presentation"
      aria-hidden="true"
      focusable="false"
      height={size || height}
      width={size || width}
      viewBox="0 0 24 24"
      {...props}
      ref={ref}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10a9.965 9.965 0 0 1-4.262-.951l-4.537.93a1 1 0 0 1-1.18-1.18l.93-4.537A9.965 9.965 0 0 1 2 12m5.5-1.5A1.5 1.5 0 0 0 6 12v.01a1.5 1.5 0 0 0 1.5 1.5h.01a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5zm4.5 0a1.5 1.5 0 0 0-1.5 1.5v.01a1.5 1.5 0 0 0 1.5 1.5h.01a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5zm3 1.5a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5h-.01a1.5 1.5 0 0 1-1.5-1.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
);

CommentIcon.displayName = "CommentIcon";
