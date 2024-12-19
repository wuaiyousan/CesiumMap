<!--
 * @Author: fishScola
 * @Date: 2022-10-13 10:23:43
 * @LastEditors: fishScola
 * @LastEditTime: 2023-05-11 15:55:10
 * @Description: 营业收费
-->
<script setup>
import FirstLayer from './FirstLayer.vue';
import SecondLayer from './SecondLayer.vue';
import ThirdLayer from './ThirdLayer.vue';
</script>

<template>
	<div class="component-wrapper business-overview">
		<FirstLayer></FirstLayer>
		<SecondLayer></SecondLayer>
		<ThirdLayer></ThirdLayer>
	</div>
</template>

<style lang="less">
.component-wrapper.business-overview {
	height: calc(100% - 200px);
	position: absolute;
	top: 115px;
  width: 100%;
  padding: 0 35px;
	z-index: 10;
	.layer {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: calc(33% - 10px);
		.layer-box {
			width: calc(33% - 10px);
			height: 100%;
			::v-deep(.content) {
				padding: 10px 30px;
				height: calc(100% - 58px);
				border: 1.43px solid;
				border-image: linear-gradient(
						270deg,
						rgba(5, 20, 37, 0.69) 0%,
						#539dff 51%,
						rgba(0, 0, 0, 0.68)
					)
					1.4307291507720947 1.4307291507720947;
			}
		}
	}
}

</style>
