<script lang="ts">
import To from "./to.vue";

interface data {
  s: any;
}
export default {
  name: "title",
  props: {
    name: String,
  },
  components: { To },
  data(): data {
    return {
      s: this.$style,
    };
  },
};
</script>
<template>
  <div :class="s.title">
    <To><i class="fa-solid fa-circle-left" /></To>
    {{ name }}
  </div>
</template>
<style lang="scss" module>
.title {
  width: 100%;
  text-align: center;
  padding: 8px 0;
  margin-bottom: 8px;
  font-size: 20px;
  a {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 40px;
    height: 40px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i {
      font-size: 28px;
    }
  }
}
</style>
