import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RollingWave } from "./types";

interface WaveState {
    waves: Record<string, RollingWave>;

    createWave: (data: Omit<RollingWave, "id">) => void;
    attachSubCategory: (waveId: string, subId: string) => void;
    detachSubCategory: (waveId: string, subId: string) => void;
}

export const useWaveStore = create<WaveState>()(
    persist(
        (set) => ({
            waves: {},

            createWave: (data) =>
                set((state) => {
                    const id = crypto.randomUUID();
                    state.waves[id] = { ...data, id };
                }),

            attachSubCategory: (waveId, subId) =>
                set((state) => {
                    state.waves[waveId].subCategoryIds.push(subId);
                }),

            detachSubCategory: (waveId, subId) =>
                set((state) => {
                    state.waves[waveId].subCategoryIds =
                        state.waves[waveId].subCategoryIds.filter(
                            (id) => id !== subId
                        );
                }),
        }),
        {
            name: "rolling-waves-wave-store",
        }
    )
);
