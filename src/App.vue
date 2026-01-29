<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <FloatingServiceMenu />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import FloatingServiceMenu from './components/FloatingServiceMenu.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  margin-top: 64px;
}
</style>
