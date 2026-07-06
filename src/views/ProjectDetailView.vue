<template>
  <div class="project-detail-container">
    <router-link to="/" class="back-btn">← Back to Portfolio</router-link>
    
    <div v-if="loading" class="status">Querying deep data layers...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    
    <article v-else-if="project" class="project-profile">
      <header class="project-header">
        <h2>{{ project.title }}</h2>
        <span class="client-badge">{{ project.projectDetails?.clientName }}</span>
      </header>
      
      <div class="project-body">
        <div class="metrics-sidebar">
          <h3>Project Metrics</h3>
          <div class="metric-row">
            <span class="label">Financial Budget:</span>
            <span class="value">£{{ project.projectDetails?.projectBudget?.toLocaleString() }}</span>
          </div>
          <div class="metric-row">
            <span class="label">Target Launch:</span>
            <span class="value">{{ formatDate(project.projectDetails?.launchDate) }}</span>
          </div>
        </div>
        
        <div class="content-main">
          <h3>Scope of Work</h3>
          <div v-if="project.content" v-html="project.content" class="wordpress-content"></div>
          <p v-else class="no-content">No supplemental scope text provided for this ledger entry.</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gql } from 'graphql-request';
import { graphQLClient } from '../api/client';

// Accept the dynamic router slug directly as a component configuration property
const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const project = ref(null);
const loading = ref(true);
const error = ref(null);

// Targeted GraphQL query utilizing schema filter variables
const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($id: ID!) {
    project(id: $id, idType: SLUG) {
      title
      content
      projectDetails {
        clientName
        projectBudget
        launchDate
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
    // Pass the route component property slug directly into the operational GraphQL parameters argument object
    const data = await graphQLClient.request(GET_PROJECT_BY_SLUG, { id: props.slug });
    project.value = data.project;
    if (!data.project) {
      error.value = 'Requested project data ledger could not be found.';
    }
  } catch (err) {
    console.error('Individual node pull failed:', err);
    error.value = 'Failed to fetch the target project node details.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.project-detail-container { max-width: 900px; margin: 0 auto; }
.back-btn { display: inline-block; margin-bottom: 2rem; color: #41b883; text-decoration: none; font-weight: bold; font-size: 0.95rem; }
.back-btn:hover { text-decoration: underline; }
.status { text-align: center; font-weight: bold; color: #e67e22; padding: 3rem; }
.error { color: #c0392b; }

.project-profile { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
.project-header { border-bottom: 2px solid #edf2f7; padding-bottom: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; }
.project-header h2 { margin: 0; color: #1a252f; font-size: 2rem; }
.client-badge { background: #ebf8ff; color: #2b6cb0; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }

.project-body { display: grid; grid-template-columns: 1fr 2fr; gap: 2.5rem; }
@media (max-width: 768px) { .project-body { grid-template-columns: 1fr; } }

.metrics-sidebar { background: #f7fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; height: fit-content; }
.metrics-sidebar h3 { margin-top: 0; margin-bottom: 1.25rem; font-size: 1.1rem; color: #4a5568; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
.metric-row { display: flex; flex-direction: column; margin-bottom: 1rem; }
.metric-row:last-child { margin-bottom: 0; }
.metric-row .label { font-size: 0.85rem; color: #718096; font-weight: 600; text-transform: uppercase; }
.metric-row .value { font-size: 1.2rem; color: #2d3748; font-weight: 700; margin-top: 0.25rem; }

.content-main h3 { margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem; color: #2d3748; }
.wordpress-content { color: #4a5568; line-height: 1.7; }
.no-content { color: #a0aec0; font-style: italic; }
</style>