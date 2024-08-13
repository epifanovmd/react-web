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
    initialLoad?: boolean;
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
}

export const useAsyncSelect = <
    V extends string | number | null,
    SomeValues extends object,
    Mode extends TSelectMode | undefined = undefined,
    ShowSearch extends boolean | undefined = true,
>({
    initialLoad,
    fetchFn,
    minQueryLength,
    debounceTimeout = 300,
    showSearch,
    open,
}: IUseAsyncSelectOptions<V, SomeValues, Mode, ShowSearch>) => {
    const [query, setQuery] = useDebouncedState("", debounceTimeout);
    const [options, setOptions] = useState<TSelectOption<V, SomeValues>[]>([]);
    const [pending, setPending] = useState(true);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (open !== undefined && !open && showSearch) {
            setQuery("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const searchQuery = query.trim();

    const fetchOptions = useCallback(
        async (q: string = "") => {
            setOptions([]);
            setFetching(true);

            const options = await fetchFn(q).catch(() => []);

            setOptions(options);
            setFetching(false);
            setPending(false);
        },
        [fetchFn],
    );

    useEffect(() => {
        if (!showSearch || initialLoad) {
            fetchOptions().then();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            searchQuery.length >= minQueryLength ||
            (initialLoad && searchQuery.length === 0)
        ) {
            fetchOptions(searchQuery).then();
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
        pending,
        fetching,
        clear,
        query,
        setQuery,
        searchPlaceholder,
    };
};
