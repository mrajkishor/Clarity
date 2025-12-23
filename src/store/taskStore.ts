import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SubCategory, TaskCategory } from "./types";

interface TaskState {
    categories: Record<string, TaskCategory>;
    subCategories: Record<string, SubCategory>;

    addCategory: (title: string) => void;
    addSubCategory: (categoryId: string, title: string) => void;

    updateSubCategory: (
        id: string,
        data: Partial<SubCategory>
    ) => void;

    deleteSubCategory: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            categories: {},
            subCategories: {},

            addCategory: (title) =>
                set((state) => {
                    const id = crypto.randomUUID();
                    state.categories[id] = {
                        id,
                        title,
                        subCategoryIds: [],
                    };
                }),

            addSubCategory: (categoryId, title) =>
                set((state) => {
                    const id = crypto.randomUUID();
                    state.subCategories[id] = {
                        id,
                        title,
                        comment: "",
                        color: "gray",
                        status: "IN_PROGRESS",
                        completion: 0,
                        importance: "MEDIUM",
                    };
                    state.categories[categoryId].subCategoryIds.push(id);
                }),

            updateSubCategory: (id, data) =>
                set((state) => {
                    Object.assign(state.subCategories[id], data);
                }),

            deleteSubCategory: (id) =>
                set((state) => {
                    delete state.subCategories[id];
                    Object.values(state.categories).forEach((cat) => {
                        cat.subCategoryIds = cat.subCategoryIds.filter(
                            (sid) => sid !== id
                        );
                    });
                }),
        }),
        {
            name: "rolling-waves-task-store",
        }
    )
);
