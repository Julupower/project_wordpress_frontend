<template>
  <div class="not-found-container" style="text-align: center; padding: 100px 20px; font-family: sans-serif;">
    <h1 style="font-size: 4rem; color: #64748b; margin-bottom: 10px;">404</h1>
    <h2 style="font-size: 1.75rem; color: #1e293b; margin-bottom: 20px;">Project Not Found</h2>
    <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 30px; max-width: 500px; margin-left: auto; margin-right: auto;">
      The project asset you are looking for does not exist or may have been removed from the CMS database.
    </p>
    <router-link to="/" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; transition: background 0.2s;">
      Return to Portfolio
    </router-link>
  </div>
</template>

<script setup>
// Static presentation view component; no dynamic state tracking required.
</script>
