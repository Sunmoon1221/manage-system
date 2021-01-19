<template>
  <div class="search">
    <input type="text" 
		:placeholder="inputPlaceholder" 
		:value="currentValue"
		@input="Oninput" 
		@keyup.enter="clickSearchButton"
		/>
    <img
      class="searchButton"
      src="../../../assets/image/search/search.png"
      alt=""
			@click="clickSearchButton"
			
    />
  </div>
</template>

<script>
export default {
  props: {
    inputPlaceholder: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
			currentValue: this.value
		};
  },
  methods: {
		Oninput($event){
      this.currentValue = $event.target.value;
      this.$emit('input',$event.target.value)
		},
		clickSearchButton() {
			this.$emit('search')
		}
	},
};
</script>

<style lang="less" scoped>
.search {
  height: 30px;
}
input {
  box-sizing: border-box;
  border: 1px solid #ccc;
  cursor: pointer;
  height: 30px;
  text-indent: 12px;
  transition: width 400ms ease, background 400ms ease, border-radius 400ms ease;
  width: 80px;
  border-radius: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

input:focus {
  background-color: #fff;
  border: 2px solid #2bb2e8b0;
  border-radius: 10px;
  cursor: text;
  outline: 0;
  width: 230px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.searchButton {
  width: 24px;
  vertical-align: middle;
  box-sizing: border-box;
  cursor: pointer;
}
</style>