import { Importance, Status } from "@/store/types";

export function getCarryOverSuggestion(
    status: Status,
    completion: number,
    importance: Importance
) {
    if (status === "BLOCKED") return "Yes – Blocked";
    if (completion >= 1) return "No";
    if (completion >= 0.2) return "Split";
    if (importance === "HIGH") return "Yes – Priority";
    return "Yes – Deprioritized";
}
