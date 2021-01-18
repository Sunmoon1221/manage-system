<template>
  <div class="home">
    <el-container class="container">
      <!-- 侧边栏 -->
      <el-aside
        class="aside"
        :width="isCollapse ? '64px' : '200px'"
      >
        <!-- 折叠 -->
				<CollapseAside class="collapse-box" @click.native="collapseAside" :collapse="isCollapse"></CollapseAside>
        <img class="logo" v-show="!isCollapse" src="../../assets/image/logo/logo.png" alt="" />
        <img class="logo" v-show="isCollapse" src="../../assets/image/logo/logo2.png" alt="" />
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          unique-opened
          :collapse="isCollapse"
					:collapse-transition="false"
					router
        >
          <el-submenu
            :index="'/' + item.path"
            v-for="item in asideMenu"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + item.path"
              v-for="item in item.children"
              :key="item.id"
            >
              <template slot="title">
                <i class="el-icon-collection-tag"></i>
                <span slot="title">{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主体 -->
      <el-main class="main">
				<router-view></router-view>
			</el-main>
    </el-container>
  </div>
</template>

<script>
import { getMenus } from "../../network/power";
import CollapseAside from "../../components/common/collapse/CollapseAside"
export default {
	components: {
		CollapseAside
	},
  data() {
    return {
      asideMenu: [],
      icons: {
        125: "iconfont iconyonghu",
        103: "iconfont iconquanxian",
        101: "iconfont iconshangpin",
        102: "iconfont icondingdan",
        145: "iconfont iconshuju",
      },
      isCollapse: false,
    };
  },
  created() {
    this.getAsideMenus();
  },
  methods: {
    async getAsideMenus() {
      const { data: res } = await getMenus();
      // console.log(res)
      this.asideMenu = res.data;
      console.log(this.asideMenu);
    },

    collapseAside() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
body {
  background-color: #fff;
}
.container {
  height: 100vh;
}
.aside {
	position: relative;
  background-color: #fff;
  text-align: center;
  overflow-y: hidden;

  .logo {
    width: 90%;
    margin: 10px 0;
  }
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border-right: none;
	}
	// 修改CollapseAside的位置
	.collapse-box {
		position: absolute;
		bottom: 0;
	}
}
.main {
  background-color: #f5f7fb;
}

// .box {
//   width: 50px;
//   height: 50px;
//   background-color: blue;
// }
</style>