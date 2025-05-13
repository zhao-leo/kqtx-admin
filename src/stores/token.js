// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
  }),

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    clearToken() {
      this.token = null
      localStorage.removeItem('token')
    },

    getToken() {
      return this.token
    },
  },
})
