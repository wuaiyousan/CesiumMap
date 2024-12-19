<!--
 * @Author: fishScola
 * @Date: 2022-10-13 21:56:44
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-21 10:37:14
 * @Description: 工艺信息
-->
<script setup>
const { url } = defineProps({
	url: {
		type: String,
		default: function () {
			return '';
		},
	},
});
import NullImg from '@/assets/img/modify/null.png';
</script>

<template>
	<div class="component-wrapper craft-info">
		<el-image class="left" :src="url" :preview-src-list="[url]" alt="工艺图">
			<template #error>
				<div class="error-tips">
					<img class="null-img" :src="NullImg" alt="" />
					暂无数据
				</div>
			</template>
		</el-image>
	</div>
</template>

<style lang="less" scoped>
.component-wrapper.craft-info {
	position: relative;
	height: 100%;

	.left {
		height: 100%;

		.error-tips {
			display: flex;
			height: 100%;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			border-radius: 4px;
			border: 1px solid rgba(143, 203, 255, 0.2);
			padding: 0 6px;
			.null-img {
				width: 80px;
				height: 80px;
			}
		}
	}
}
</style>
