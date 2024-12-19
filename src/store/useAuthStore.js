/*
 * @Author: fishScola
 * @Date: 2022-05-27 14:53:08
 * @LastEditors: fishScola
 * @LastEditTime: 2022-07-01 17:46:04
 * @Description: useAuthStore
 */
import { defineStore } from 'pinia'
import md5 from 'js-md5'
import { loginByUsername, logout, refreshToken } from '@/api/system/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
      // 定时请求处理
      timer: null,
      remaining: null,
    }
  },
  actions: {
    async doLoginByUser(info) {
      let oldToken = getToken()
      if (oldToken) {
        removeToken()
      }
      let res = await loginByUsername(
        info.tenantId,
        info.username,
        md5(info.password),
        info.type,
        info.key,
        info.code
      )
      this.updateAuth(res)
    },
    async doLogout() {
      return logout().then((res) => {
        this.authFailure()
      })
    },
    refreshInterval(info) {
      if (this.timer) {
        window.clearTimeout(this.timer)
        this.timer = null
      }
      this.remaining = Math.max(Number(info.expires_in) - 30, 1)
      this.timer = window.setInterval(() => {
        this.remaining -= 10
        if (this.remaining <= 10) {
          let { refresh_token, tenant_id } = this.userInfo
          if (refresh_token) {
            refreshToken(refresh_token, tenant_id).then((res) => {
              this.updateAuth(res)
            })
            window.clearTimeout(this.timer)
            this.timer = null
          }
        }
      }, 10000)
    },
    // 更新
    updateAuth(obj) {
      let out = obj || {}
      this.authSuccess({
        token: out.access_token,
        user: out,
      })
      // 启动刷新token
      this.refreshInterval(out)
    },
    authSuccess({ user, token }) {
      sessionStorage.setItem('userInfo', JSON.stringify(user))
      this.userInfo = user
      setToken(token)
    },
    authFailure() {
      sessionStorage.removeItem('userInfo')
      this.userInfo = {}
      removeToken()
    },
  },
})
