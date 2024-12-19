/*
 * @Author: fishScola
 * @Date: 2022-05-30 19:06:00
 * @LastEditors: fishScola
 * @LastEditTime: 2022-05-30 19:06:05
 * @Description: auth
 */
import Cookies from 'js-cookie'
const TokenKey = 'saber-access-token'
const RefreshTokenKey = 'saber-refresh-token'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}
