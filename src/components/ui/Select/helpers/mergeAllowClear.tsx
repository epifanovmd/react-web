import { isBoolean } from "lodash";
import React from "react";

import { SelectClearIcon } from "../icons";

export const mergeAllowClear = (
  allowClear?:
    | boolean
    | {
        clearIcon?: React.ReactNode | ((props: any) => React.ReactNode);
      },
) =>
  allowClear
    ? isBoolean(allowClear)
      ? { clearIcon: <SelectClearIcon /> }
      : allowClear
    : undefined;
