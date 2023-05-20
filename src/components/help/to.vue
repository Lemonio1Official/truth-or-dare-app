<script lang="ts">
interface data {
  s: any;
}
export default {
  name: "To",
  props: {
    to: String,
  },
  data(): data {
    return {
      s: this.$style,
    };
  },
  methods: {
    change() {
      this.$store.dispatch("changePath", this.to ? this.to : "menu");
    },
  },
};
</script>
<template>
  <a :class="s.to" @click.prevent="change"><slot></slot></a>
</template>
<style lang="scss" module>
.to {
  cursor: pointer;
}
</style>
