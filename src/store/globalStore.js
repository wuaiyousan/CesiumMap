import { defineStore } from 'pinia'

export const globalStore = defineStore('global', {
  state: () => {
    return {
      changeScale: 1,
    }
  },
  actions: {
    setScale(scale) {
      this.changeScale = scale
    },
    getScale(){
      return this.changeScale
    }
  },
})