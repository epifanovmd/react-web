import { useDebouncedState } from "@force-dev/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { selectSearchPlaceholder } from "../constants";
import { IAsyncSelectProps, TSelectMode, TSelectOption } from "../types";

export interface IUseAsyncSelectOptions<
  V extends string | number | null,
  SomeValues extends object,
  Mode extends TSelectMode | undefined = undefined,
  ShowSearch extends boolean | undefined = true,
> {
  fetchOnInit?: boolean;
  fetchFn: IAsyncSelectProps<
    V,
    SomeValues,
    Mode,
    undefined,
    ShowSearch
  >["fetchFn"];
  minQueryLength: number;
  debounceTimeout: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  open?: boolean;
  filterOption?: boolean;
  defaultOptions?: TSelectOption<V, SomeValues>[];
}

export const useAsyncSelect = <
  V extends string | number | null,
  SomeValues extends object,
  Mode extends TSelectMode | undefined = undefined,
  ShowSearch extends boolean | undefined = true,
>({
  fetchOnInit,
  fetchFn,
  minQueryLength,
  debounceTimeout = 300,
  showSearch,
  open,
  filterOption,
  defaultOptions = [],
}: IUseAsyncSelectOptions<V, SomeValues, Mode, ShowSearch>) => {
  const [query, setQuery] = useDebouncedState("", debounceTimeout);
  const [options, setOptions] =
    useState<TSelectOption<V, SomeValues>[]>(defaultOptions);
  const [fetching, setFetching] = useDebouncedState(false, debounceTimeout);

  const searchQuery = query.trim();
  const availableSearchLength = searchQuery.length >= minQueryLength;
  const availableSearch = availableSearchLength && !filterOption;

  useEffect(() => {
    if (open !== undefined && !open && showSearch) {
      setQuery("");
      setOptions(defaultOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchOptions = useCallback(
    async (q = "") => {
      if (defaultOptions) {
        const filteredOptions = defaultOptions.filter(item =>
          item.label.toLowerCase().includes(q.toLowerCase()),
        );

        if (filteredOptions.length > 0) {
          setOptions(filteredOptions);

          return;
        }
      }
      setOptions([]);
      setFetching(true);

      const options = await fetchFn(q).catch(() => []);

      setOptions(options);
      setFetching(false);
    },
    [defaultOptions, fetchFn, setFetching],
  );

  useEffect(() => {
    if (fetchOnInit && !defaultOptions) {
      fetchOptions().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnInit]);

  useEffect(() => {
    if (availableSearch) {
      fetchOptions(searchQuery).then();
    } else {
      setOptions(defaultOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const clear = useCallback(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  const searchPlaceholder = useMemo(
    () => `Поиск от ${selectSearchPlaceholder(minQueryLength)} символов`,
    [minQueryLength],
  );

  return {
    options,
    fetching,
    clear,
    query,
    setQuery,
    searchPlaceholder,
    availableSearchLength,
    availableSearch,
  };
};
