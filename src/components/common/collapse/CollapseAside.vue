<template>
  <div class="collapse">
    <div :class="{'arrow-collapse':collapse ,'arrow':!collapse}"></div>
  </div>
</template>

<script>
export default {
	props: {
		// 是否折叠
		collapse: {
			type: Boolean,
			default: false
		}
	},
};
</script>

<style lang="less" scoped>
.collapse {
  position: relative;
	height: 40px;
	width: 100%;
	background-color: #fff;
	cursor: pointer;
}

.arrow,.arrow-collapse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-135deg);
  line-height: 40px;
  height: 10px;
  width: 10px;
  border: 1px solid transparent;
  border-right-color: #2bb1e8;
	border-top-color: #2bb1e8;
	transition:all  ease-in .2s;
}
.arrow-collapse {
  transform: translate(-50%, -50%) rotate(45deg);
}
</style>