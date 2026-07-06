<template>
  <div class="app-container">
    <header>
      <router-link to="/" class="brand-link">
        <h1>PROJECT WORDPRESS</h1>
      </router-link>
      <p class="tagline">Decoupled Architecture Showcase</p>
    </header>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  color: #2c3e50;
}
header {
  text-align: center;
  margin-bottom: 3rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 1.5rem;
}
.brand-link {
  text-decoration: none;
  color: inherit;
}
h1 { margin-bottom: 0.5rem; color: #1a252f; }
.tagline { color: #7f8c8d; font-style: italic; margin: 0; }
</style>