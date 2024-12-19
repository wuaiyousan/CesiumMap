/*
 * @Author: fishScola
 * @Date: 2022-06-14 13:37:25
 * @LastEditors: fishScola
 * @LastEditTime: 2022-06-14 13:37:58
 * @Description: eventHub
 */

import Mitt from 'mitt'

const eventHub = new Mitt()

eventHub.$on = eventHub.on
eventHub.$off = eventHub.off
eventHub.$emit = eventHub.emit

export default eventHub
