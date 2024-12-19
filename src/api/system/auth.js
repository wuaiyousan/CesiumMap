/*
 * @Author: fishScola
 * @Date: 2022-04-26 16:02:39
 * @LastEditors: fishScola
 * @LastEditTime: 2023-07-26 11:35:23
 * @Description:
 */
import request from '../instance'
import { website, api } from '@/common/ProjConfig'

export const loginByUsername = (
  tenantId,
  username,
  password,
  type,
  key,
  code
) =>
  request({
    url: `${api}/blade-auth/oauth/token`,
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
      'Captcha-Key': key,
      'Captcha-Code': code,
    },
    params: {
      tenantId,
      username,
      password,
      grant_type: website.captchaMode ? 'captcha' : 'password',
      scope: 'all',
      type,
    },
  })

export const refreshToken = (refresh_token, tenantId) =>
  request({
    url: `${api}/blade-auth/oauth/token`,
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
    },
    params: {
      tenantId,
      refresh_token,
      grant_type: 'refresh_token',
      scope: 'all',
    },
  })

export const logout = () =>
  request({
    url: `${api}/blade-auth/oauth/logout`,
    method: 'get',
  })

export const getCaptcha = () =>
  request({
    url: `${api}/blade-auth/oauth/captcha`,
    method: 'get',
  })
