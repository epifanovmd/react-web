import React, { FC } from "react";

export const SelectCaretIcon: FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={12}
    width={12}
    viewBox="0 0 16 16"
    {...props}
  >
    <path fill="none" stroke="rgba(44, 56, 74, 0.681)" d="M2 5l6 6 6-6" />
  </svg>
);
