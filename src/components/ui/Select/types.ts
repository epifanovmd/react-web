import { BaseSelectRef, SelectProps } from "rc-select";
import * as React from "react";

export type TSelectMode = "combobox" | "multiple" | "tags";

export type TSelectOption<
  V extends string | number | null,
  SomeValues extends object = object,
> = {
  value: V;
  label: string;

  // BaseOptionType
  disabled?: boolean;
  className?: string;
  title?: string;
} & SomeValues;

export type TSelectValue<V extends string | number | null> = Pick<
  TSelectOption<TSelectOption<V>["value"]>,
  "value" | "label" | "disabled" | "title"
> & {
  key?: TSelectOption<V>["value"];
};

type TResolveSelectValue<
  Value,
  Mode extends TSelectMode | undefined = undefined,
> = Mode extends "multiple" ? Value[] : Mode extends "tags" ? Value[] : Value;

type TOptionWithMode<
  Option,
  Mode extends TSelectMode | undefined = undefined,
> = Mode extends "multiple"
  ? Option[]
  : Mode extends "tags"
  ? Option[]
  : Option;

export type ISelectRef = BaseSelectRef;

export type TAllowClear =
  | boolean
  | {
      clearIcon?: React.ReactNode | ((props: any) => React.ReactNode);
    };

export interface ISelectProps<
  V extends string | number | null = string | number | null,
  SomeValues extends object = object,
  Mode extends TSelectMode | undefined = undefined,
  LabelInValue extends boolean | undefined = undefined,
  AllowClear extends TAllowClear | undefined = undefined,
> extends Omit<
    SelectProps<
      TResolveSelectValue<
        LabelInValue extends true ? TSelectValue<V> : V,
        Mode
      >,
      TSelectOption<V, SomeValues>
    >,
    | "mode"
    | "options"
    | "defaultValue"
    | "value"
    | "onChange"
    | "labelInValue"
    | "allowClear"
  > {
  valid?: boolean;

  labelInValue?: LabelInValue;
  mode?: Mode;
  options?: TSelectOption<V, SomeValues>[];
  defaultValue?: TResolveSelectValue<TSelectValue<V>, Mode> | null;
  value?: TResolveSelectValue<
    | V
    | (Partial<Omit<TSelectValue<V>, "value">> &
        Required<Pick<TSelectValue<V>, "value">>),
    Mode
  > | null;
  allowClear?: AllowClear;
  onChange?: AllowClear extends true
    ? (
        value?: TResolveSelectValue<
          LabelInValue extends true ? TSelectValue<V> : V,
          Mode
        >,
        option?: TOptionWithMode<TSelectOption<V, SomeValues>, Mode>,
      ) => void
    : (
        value: TResolveSelectValue<
          LabelInValue extends true ? TSelectValue<V> : V,
          Mode
        >,
        option: TOptionWithMode<TSelectOption<V, SomeValues>, Mode>,
      ) => void;
  ref?: React.LegacyRef<ISelectRef>;
}

export interface IAsyncSelectProps<
  V extends string | number | null = string | number | null,
  SomeValues extends object = object,
  Mode extends TSelectMode | undefined = undefined,
  LabelInValue extends boolean | undefined = undefined,
  ShowSearch extends boolean | undefined = undefined,
  AllowClear extends TAllowClear | undefined = undefined,
> extends Omit<
    ISelectProps<V, SomeValues, Mode, LabelInValue, AllowClear>,
    "options" | "children" | "showSearch"
  > {
  showSearch?: ShowSearch;
  minQueryLength?: number;
  fetchFn: ShowSearch extends undefined
    ? () => Promise<TSelectOption<V, SomeValues>[]>
    : (query: string) => Promise<TSelectOption<V, SomeValues>[]>;
  debounceTimeout?: number;
  searchPlaceholder?: string;
  loadingPlaceholder?: string;
  fetchOnInit?: boolean;
  defaultOptions?: TSelectOption<V, SomeValues>[];
}
