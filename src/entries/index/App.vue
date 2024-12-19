<!--
 * @Author: fishScola
 * @Date: 2022-04-25 11:09:09
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-08-28 10:38:11
 * @Description: app
-->
<script setup>
import { projTitle } from '@/common/ProjConfig.js';
import { onMounted } from 'vue';
onMounted(() => {
	document.title = projTitle;
});
</script>

<template>
	<router-view></router-view>
</template>

<style>
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	background: black;
	max-width: none;
	box-sizing: border-box;
}
</style>
