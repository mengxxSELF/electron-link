<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'; // eslint-disable-line

export default {
  name: 'App',
  methods: {
    autoUpdate() {
      ipcRenderer.send('update');
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
