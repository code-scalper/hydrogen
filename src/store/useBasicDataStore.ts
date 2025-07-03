import { throttledBackup } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 타입 정의
interface DataEntry {
	key: string;
	value: string;
}

interface DataInterface {
	id: string;
	data: DataEntry[];
}

interface BasicDataState {
	dataset: DataInterface[];
	setValue: (id: string, key: string, value: string) => void;
	getDatasetById: (id: string) => DataEntry[] | undefined;
	resetDataset: () => void;
}

export const useBasicDataStore = create<BasicDataState>()(
	persist(
		(set, get) => ({
			dataset: [],

			setValue: (id, key, value) => {
				const currentDataset = get().dataset;
				const existing = currentDataset.find((d) => d.id === id);

				let updatedDataset: DataInterface[];

				if (existing) {
					const updatedData = existing.data.some((entry) => entry.key === key)
						? existing.data.map((entry) =>
								entry.key === key ? { ...entry, value } : entry,
							)
						: [...existing.data, { key, value }];

					updatedDataset = currentDataset.map((d) =>
						d.id === id ? { ...d, data: updatedData } : d,
					);
				} else {
					updatedDataset = [...currentDataset, { id, data: [{ key, value }] }];
				}

				set({ dataset: updatedDataset });
				throttledBackup(updatedDataset, "BASIC_DATA");
			},

			getDatasetById: (id) => {
				return get().dataset.find((d) => d.id === id)?.data;
			},

			resetDataset: () => set({ dataset: [] }),
		}),
		{
			name: "basic-data-store",
		},
	),
);
