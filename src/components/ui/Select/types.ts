import { BaseSelectRef, SelectProps } from "rc-select";

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
    key: TSelectOption<V>["value"];
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

export interface ISelectProps<
    V extends string | number | null = string | number | null,
    SomeValues extends object = object,
    Mode extends TSelectMode | undefined = undefined,
    LabelInValue extends boolean | undefined = undefined,
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
    onChange?: (
        value: TResolveSelectValue<
            LabelInValue extends true ? TSelectValue<V> : V,
            Mode
        >,
        option: TOptionWithMode<TSelectOption<V, SomeValues>, Mode>,
    ) => void;
}

export interface IAsyncSelectProps<
    V extends string | number | null = string | number | null,
    SomeValues extends object = object,
    Mode extends TSelectMode | undefined = undefined,
    LabelInValue extends boolean | undefined = undefined,
    ShowSearch extends boolean | undefined = undefined,
> extends Omit<
        ISelectProps<V, SomeValues, Mode, LabelInValue>,
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
    initialLoad?: boolean;
}
