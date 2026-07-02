<template>
  <div class="app-container">
    <header v-if="siteMetadata">
      <h1>{{ siteMetadata.title }}</h1>
      <p class="tagline">{{ siteMetadata.description }}</p>
    </header>
    
    <main>
      <div v-if="loading" class="status">Connecting to WordPress API Engine...</div>
      <div v-else-if="error" class="status error">Error: {{ error }}</div>
      <div v-else class="success-box">
        <p>✓ Connection established successfully over local ports.</p>
        <p>Your Vue 3 frontend is reading live data from Headless WordPress.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gql } from 'graphql-request';
import { graphQLClient } from './api/client';

// Reactive state variables
const siteMetadata = ref(null);
const loading = ref(true);
const error = ref(null);

// The exact GraphQL query layout to match our WordPress schema
const SITE_INFO_QUERY = gql`
  query GetSiteSettings {
    generalSettings {
      title
      description
    }
  }
`;

onMounted(async () => {
  try {
    const data = await graphQLClient.request(SITE_INFO_QUERY);
    siteMetadata.value = data.generalSettings;
  } catch (err) {
    console.error('API Connection Failed:', err);
    error.value = 'Could not pull data from the backend container.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.app-container {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
}
h1 { color: #2c3e50; margin-bottom: 0.5rem; }
.tagline { color: #7f8c8d; font-style: italic; margin-top: 0; }
.status { color: #e67e22; font-weight: bold; }
.error { color: #c0392b; }
.success-box {
  background: #e8f8f5;
  color: #117a65;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #a3e4d7;
  margin-top: 1.5rem;
}
</style>