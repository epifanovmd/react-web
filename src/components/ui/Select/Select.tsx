import "./index.scss";

import RCSelect from "rc-select";
import * as React from "react";
import { forwardRef, memo } from "react";

import { getValidateClassName, mergeAllowClear } from "./helpers";
import { SelectCaretIcon } from "./icons";
import { ISelectProps, ISelectRef, TSelectMode } from "./types";

const _Select = <
  V extends string | number | null,
  SomeValues extends object,
  Mode extends TSelectMode | undefined = undefined,
  LabelInValue extends boolean | undefined = undefined,
>(
  {
    allowClear,
    suffixIcon,
    className,
    valid,
    loading,
    ...rest
  }: ISelectProps<V, SomeValues, Mode, LabelInValue> & {
    ref?: React.LegacyRef<ISelectRef>;
  },
  ref: React.LegacyRef<ISelectRef>,
) => {
  const mergedSuffixIcon = !loading
    ? suffixIcon ?? <SelectCaretIcon />
    : undefined;

  return (
    <RCSelect<any, any>
      ref={ref}
      loading={loading}
      prefixCls={"react-select"}
      className={`${className} ${getValidateClassName(valid)}`}
      suffixIcon={mergedSuffixIcon}
      allowClear={!!rest.value && mergeAllowClear(allowClear)}
      virtual={rest.options && rest.options.length > 60}
      {...rest}
    />
  );
};

export const Select = memo(forwardRef(_Select)) as typeof _Select;
