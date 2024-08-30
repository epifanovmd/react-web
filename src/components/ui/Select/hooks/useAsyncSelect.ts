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
}: IUseAsyncSelectOptions<V, SomeValues, Mode, ShowSearch>) => {
  const [query, setQuery] = useDebouncedState("", debounceTimeout);
  const [options, setOptions] = useState<TSelectOption<V, SomeValues>[]>([]);
  const [fetching, setFetching] = useDebouncedState(false, debounceTimeout);

  const searchQuery = query.trim();
  const availableSearchLength = searchQuery.length >= minQueryLength;
  const availableSearch = availableSearchLength && !filterOption;

  useEffect(() => {
    if (open !== undefined && !open && showSearch) {
      setQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchOptions = useCallback(
    async (q = "") => {
      setOptions([]);
      setFetching(true);

      const options = await fetchFn(q).catch(() => []);

      setOptions(options);
      setFetching(false);
    },
    [fetchFn, setFetching],
  );

  useEffect(() => {
    if (fetchOnInit) {
      fetchOptions().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnInit]);

  useEffect(() => {
    if (availableSearch) {
      fetchOptions(searchQuery).then();
    } else {
      setOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const clear = useCallback(() => {
    setOptions([]);
  }, []);

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
