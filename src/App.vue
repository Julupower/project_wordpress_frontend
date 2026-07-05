<template>
  <div class="app-container">
    <header v-if="siteMetadata">
      <h1>{{ siteMetadata.title }}</h1>
      <p class="tagline">{{ siteMetadata.description }}</p>
    </header>
    
    <main>
      <section class="portfolio-section">
        <h2>Project Portfolio</h2>
        
        <div v-if="loading" class="status">Fetching architectural data layers...</div>
        <div v-else-if="error" class="status error">{{ error }}</div>
        
        <div v-else class="project-grid">
          <div v-for="project in projects" :key="project.title" class="project-card">
            <h3>{{ project.title }}</h3>
            <div class="meta-details">
              <p><strong>Client:</strong> {{ project.projectDetails.clientName }}</p>
              <p><strong>Budget:</strong> £{{ project.projectDetails.projectBudget?.toLocaleString() }}</p>
              <p><strong>Launch Date:</strong> {{ formatDate(project.projectDetails.launchDate) }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gql } from 'graphql-request';
import { graphQLClient } from './api/client';

// Reactive state
const siteMetadata = ref(null);
const projects = ref([]);
const loading = ref(true);
const error = ref(null);

// Combined query fetching site settings AND custom project details
const PORTFOLIO_DATA_QUERY = gql`
  query GetPortfolioData {
    generalSettings {
      title
      description
    }
    projects {
      nodes {
        title
        projectDetails {
          clientName
          projectBudget
          launchDate
        }
      }
    }
  }
`;

// Helper utility to clean up the ISO timestamp strings from the database
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  try {
    const data = await graphQLClient.request(PORTFOLIO_DATA_QUERY);
    siteMetadata.value = data.generalSettings;
    projects.value = data.projects.nodes;
  } catch (err) {
    console.error('Data pull failed:', err);
    error.value = 'Failed to extract custom records from the data layer.';
  } finally {
    loading.value = false;
  }
});
</script>

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
h1 { margin-bottom: 0.5rem; color: #1a252f; }
.tagline { color: #7f8c8d; font-style: italic; margin: 0; }
h2 { color: #34495e; border-left: 4px solid #41b883; padding-left: 10px; margin-bottom: 1.5rem; }
.status { text-align: center; font-weight: bold; color: #e67e22; padding: 2rem; }
.error { color: #c0392b; }

/* Grid Layout styling */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.project-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.project-card:hover {
  transform: translateY(-4px);
}
.project-card h3 { margin-top: 0; color: #2c3e50; font-size: 1.25rem; border-bottom: 1px solid #edf2f7; padding-bottom: 0.75rem; }
.meta-details p { margin: 0.5rem 0; font-size: 0.95rem; color: #4a5568; }
</style>