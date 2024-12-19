/*
 * @Author: fishScola
 * @Date: 2022-07-16 20:38:17
 * @LastEditors: fishScola
 * @LastEditTime: 2023-07-26 11:37:11
 * @Description: 天气等公共信息
 */
import http from "../http";
import { api } from "@/common/ProjConfig";
// 天气
export const getCurrentWeather = () => {
  return http.get(`${api}/swms-bigscreen/v2/frf/getCurrentWeather`);
};

import axios from "axios";
// 天气api
export const getWeather = () => {
  return axios({
    url: `${api}/swp-base-pipeops/bigScreen/getWeather?code=1721097258707&stationId=LGYXk`,
    method: "get",
  });
};
