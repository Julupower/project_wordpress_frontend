<template>
  <section class="portfolio-section">
    <h2>Project Portfolio</h2>
    
    <div v-if="loading" class="status">Fetching architectural data layers...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    
    <div v-else class="project-grid">
      <router-link 
        v-for="project in projects" 
        :key="project.slug" 
        :to="'/project/' + project.slug" 
        class="project-card-link"
      >
        <div class="project-card">
          <div class="card-image-wrapper">
            <img 
              v-if="project.featuredImage?.node?.sourceUrl" 
              :src="project.featuredImage.node.sourceUrl" 
              :alt="project.featuredImage.node.altText || project.title"
              class="card-thumbnail"
            />
            <div v-else class="image-placeholder">
              <span>No Graphic Asset</span>
            </div>
          </div>

          <div class="card-content">
            <h3>{{ project.title }}</h3>
            <div class="meta-details">
              <p><strong>Client:</strong> {{ project.projectDetails.clientName }}</p>
              <p><strong>Budget:</strong> £{{ project.projectDetails.projectBudget?.toLocaleString() }}</p>
              <p><strong>Launch Date:</strong> {{ formatDate(project.projectDetails.launchDate) }}</p>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gql } from 'graphql-request';
import { graphQLClient } from '../api/client';

const projects = ref([]);
const loading = ref(true);
const error = ref(null);

// Updated query payload to pull down the featured image media node structure
const PORTFOLIO_DATA_QUERY = gql`
    query GetPortfolioData 
    {
        projects 
        {
            nodes 
            {
                title
                slug
                projectDetails 
                {
                    clientName
                    projectBudget
                    launchDate
                }
                featuredImage 
                {
                    node 
                    {
                        sourceUrl
                        altText
                    }
                }
            }
        }
    }
`;

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
h2 { color: #34495e; border-left: 4px solid #41b883; padding-left: 10px; margin-bottom: 1.5rem; }
.status { text-align: center; font-weight: bold; color: #e67e22; padding: 2rem; }
.error { color: #c0392b; }
.project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.project-card-link { text-decoration: none; color: inherit; }

/* Refined Card Architecture */
.project-card { 
  background: #ffffff; 
  border: 1px solid #e2e8f0; 
  border-radius: 8px; 
  overflow: hidden; /* Ensures the thumbnail corners follow the card border radius */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
  transition: transform 0.2s ease, box-shadow 0.2s ease; 
  height: 100%; 
  display: flex;
  flex-direction: column;
  box-sizing: border-box; 
}
.project-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Image Container Formatting */
.card-image-wrapper {
  width: 100%;
  height: 180px;
  background: #edf2f7;
  overflow: hidden;
  position: relative;
}
.card-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Forces the image to crop nicely without stretching proportions */
}
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  color: #a0aec0;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
}
.project-card h3 { margin-top: 0; color: #2c3e50; font-size: 1.25rem; border-bottom: 1px solid #edf2f7; padding-bottom: 0.75rem; }
.meta-details p { margin: 0.5rem 0; font-size: 0.95rem; color: #4a5568; }
/* 1. Force the router link to behave like a block-level container */
.project-grid a {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* 2. Explicitly style the fallback block text inside the image wrapper */
.image-placeholder span {
  color: #718096;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>