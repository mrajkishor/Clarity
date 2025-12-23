export type Status =
    | "IN_PROGRESS"
    | "BLOCKED"
    | "ON_HOLD"
    | "DONE"
    | "CANCELLED";

export type Importance = "HIGH" | "MEDIUM" | "LOW";

export interface SubCategory {
    id: string;
    title: string;
    comment: string;
    color: string;

    status: Status;
    completion: number; // 0–1 normalized
    importance: Importance;
}

export interface TaskCategory {
    id: string;
    title: string;
    subCategoryIds: string[];
}

export interface RollingWave {
    id: string;
    name: string;
    startDate: string;
    durationDays: number;
    goalSummary: string;
    retrospective: string;

    subCategoryIds: string[]; // references only
}
