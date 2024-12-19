<!--
 * @Author: fishScola
 * @Date: 2022-07-08 11:57:08
 * @LastEditors: wangzhipeng
 * @LastEditTime: 2023-07-20 12:00:11
 * @Description: 页面蒙层
-->
<script setup>
const { byImage } = defineProps({
	byImage: {
		type: Boolean,
		default: function () {
			return false;
		},
	},
});

const pageMaskRef = ref(null);

function loadedFn(svg) {
	// let maskEl = pageMaskRef.value;
	// let parentEl = maskEl.parentNode;
	// let mainEl = document.querySelector('#layout');
	// if (!parentEl) {
	// 	return;
	// }
	// let { width, height } = parentEl.getBoundingClientRect();
	let mainEl = document.querySelector('#layout');
	let width = mainEl.offsetWidth
	let height = mainEl.offsetHeight
	if (width && height) {
		svg.setAttribute('width', width);
		svg.setAttribute('height', height);
		svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
		// 矩形渐变区
		let rightRectEl = svg.getElementById('mask-rect-right');
		if (rightRectEl) {
			rightRectEl.setAttribute('height', height);
		}
		let leftRectEl = svg.getElementById('mask-rect-left');
		if (leftRectEl) {
			leftRectEl.setAttribute('height', height);
		}
		// 椭圆聚焦区
		let ellipseEl = svg.getElementById('mask-ellipse');
		if (ellipseEl) {
			ellipseEl.setAttribute('width', width);
			ellipseEl.setAttribute('height', height);
		}
		if (!window.maskSvg) {
			window.maskSvg = svg;
		}
	}
}

// 监听resize
function listenToResize(callback = null) {
	onMounted(() => {
		window.addEventListener('resize', callback);
	});
	onBeforeUnmount(() => {
		window.removeEventListener('resize', callback);
		if (window.maskSvg) {
			window.maskSvg = undefined;
		}
	});
}

listenToResize(() => {
	if (window.maskSvg) {
		loadedFn(window.maskSvg);
	}
});
</script>

<template>
	<div class="component-wrapper page-mask" ref="pageMaskRef">
		<div class="mask" v-if="byImage"></div>
		<SvgCmp class="svg-mask" :loadedFn="loadedFn" icon="mask" v-else></SvgCmp>
	</div>
</template>

<style lang="less">
.component-wrapper.page-mask {
	// position: relative;
	pointer-events: none;

	.svg-mask {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url('@/icons/mask.svg') no-repeat;
		z-index: 9;
	}
}
</style>
