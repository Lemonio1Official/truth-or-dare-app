<script lang="ts">
import To from "./help/to.vue";
import defaultTasks from "../data/tasks";

interface data {
  s: any;
  navs: { name: string; url: string }[];
}

export default {
  name: "menu",
  components: { To },
  data(): data {
    return {
      s: this.$style,
      navs: [
        { name: "Грати", url: "play" },
        { name: "Учасники", url: "players" },
        { name: "Завдання", url: "tasks" },
      ],
    };
  },
  methods: {
    loadTasks() {
      localStorage.setItem("tasks", JSON.stringify(defaultTasks));
      alert("Готово");
    },
  },
};
</script>
<template>
  <div :class="s.menu">
    <div :class="s.title">Правда або Дія</div>
    <nav>
      <To v-for="(i, ind) of navs" :to="i.url" :key="ind">{{ i.name }}</To>
    </nav>
    <div :class="s.loadTasks" @click="loadTasks">Завнтажити стандартні завдання</div>
  </div>
</template>
<style lang="scss" module>
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 12px 0;
  .title {
    font-size: 26px;
    font-weight: 500;
  }
  nav {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    width: 85%;
    align-items: center;
    a {
      text-decoration: none;
      width: 100%;
      background: #0003;
      text-align: center;
      padding: 15px 0;
      font-size: 20px;
      margin: 15px 0;
      font-weight: 500;
    }
  }
  .loadTasks {
    width: max-content;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%);
    padding: 12px;
    border-radius: 5px;
    background: rgba(127, 255, 67, 0.7);
    cursor: pointer;
  }
}
</style>
