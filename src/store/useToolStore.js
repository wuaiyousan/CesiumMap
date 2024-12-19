import { defineStore } from 'pinia';

export const useToolStore = defineStore('tool', {
	state: () => {
		return {
			isExpendBox: true,
		};
	},
	actions: {
		setZoomExpendBoxBool() {
			this.isExpendBox = !this.isExpendBox;
		},
		expendBoxBool() {
			this.isExpendBox = true;
		},
	},
});
