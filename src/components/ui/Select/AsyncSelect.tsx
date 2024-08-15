import * as React from "react";
import { forwardRef, memo, useCallback, useMemo, useState } from "react";

import { useAsyncSelect } from "./hooks";
import { Select } from "./Select";
import {
  IAsyncSelectProps,
  ISelectRef,
  TAllowClear,
  TSelectMode,
} from "./types";

const _AsyncSelect = <
  V extends string | number | null,
  SomeValues extends object,
  Mode extends TSelectMode | undefined = undefined,
  LabelInValue extends boolean | undefined = true,
  ShowSearch extends boolean | undefined = true,
  AllowClear extends TAllowClear | undefined = undefined,
>(
  {
    minQueryLength = 3,
    fetchFn,
    debounceTimeout = 300,
    showSearch = true,
    searchPlaceholder: _searchPlaceholder,
    loadingPlaceholder = "Загрузка...",
    onDropdownVisibleChange,
    fetchOnInit,
    filterOption,
    notFoundContent: _notFoundContent,
    ...props
  }: IAsyncSelectProps<
    V,
    SomeValues,
    Mode,
    LabelInValue,
    ShowSearch,
    AllowClear
  >,
  ref: React.LegacyRef<ISelectRef>,
) => {
  const [open, setOpen] = useState(props.open);

  const { options, setQuery, fetching, searchPlaceholder, availableSearch } =
    useAsyncSelect<V, SomeValues, Mode, ShowSearch>({
      fetchOnInit,
      fetchFn,
      minQueryLength,
      debounceTimeout,
      showSearch,
      open,
      filterOption: !!filterOption,
    });

  const loading = showSearch ? fetching : fetchOnInit && fetching;
  const placeholder = _searchPlaceholder ?? searchPlaceholder;

  const handleOnDropdownVisibleChange = useCallback(
    (open: boolean) => {
      onDropdownVisibleChange?.(open);
      setOpen(open);
    },
    [onDropdownVisibleChange],
  );

  const notFoundContent = useMemo(
    () =>
      fetching ? (
        <div className={"user-select-none"}>{loadingPlaceholder}</div>
      ) : (
        <div className={"user-select-none"}>
          {availableSearch || filterOption || !showSearch
            ? _notFoundContent ?? "Нет данных"
            : _searchPlaceholder ?? searchPlaceholder}
        </div>
      ),
    [
      _notFoundContent,
      _searchPlaceholder,
      availableSearch,
      fetching,
      filterOption,
      loadingPlaceholder,
      searchPlaceholder,
      showSearch,
    ],
  );

  return (
    <Select
      ref={ref}
      labelInValue={true as unknown as undefined}
      loading={loading}
      filterOption={filterOption ?? false}
      autoClearSearchValue={true}
      showSearch={showSearch}
      onSearch={showSearch ? setQuery : undefined}
      placeholder={placeholder}
      onDropdownVisibleChange={handleOnDropdownVisibleChange}
      notFoundContent={notFoundContent}
      options={options}
      {...props}
    />
  );
};

export const AsyncSelect = memo(
  forwardRef(_AsyncSelect),
) as typeof _AsyncSelect;
