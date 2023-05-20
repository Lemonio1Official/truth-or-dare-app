<script lang="ts">
import Menu from "./components/menu.vue";
import Players from "./components/players.vue";
import Tasks from "./components/tasks.vue";
import Play from "./components/play.vue";

const app = {
  name: "App",
  components: { Menu, Players, Tasks, Play },
};
export default app;
</script>
<template>
  <Menu v-if="$store.state.path === 'menu'" />
  <Players v-if="$store.state.path === 'players'" />
  <Tasks v-if="$store.state.path === 'tasks'" />
  <Play v-if="$store.state.path === 'play'" />
</template>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap");
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  border: none;
  outline: none;
  font-family: "Ubuntu", sans-serif;
  color: #fff;
  font-size: 16px;
}
#app {
  background: linear-gradient(#353535, #252525);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
