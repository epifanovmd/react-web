import { pluralize } from "@force-dev/utils";

export const selectSearchPlaceholder = (minQueryLength: number) =>
    pluralize(minQueryLength, {
        one: "го",
        two: "х",
        five: "и",
    });
