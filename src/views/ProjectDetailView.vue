<template>
  <div class="project-detail-container p-8" style="max-width: 800px; margin: 0 auto; font-family: sans-serif;">
    
    <router-link to="/" style="display: inline-block; margin-bottom: 20px; color: #2563eb; text-decoration: none;">
      ← Back to Projects
    </router-link>

    <div v-if="loading" class="loading-state">
      <p>Loading project details...</p>
    </div>

    <div v-else-if="project" class="project-content-view">
      <div v-if="project.featuredImage?.node?.sourceUrl" class="detail-hero-wrapper" style="margin-bottom: 24px;">
        <img 
          :src="project.featuredImage.node.sourceUrl" 
          :alt="project.title" 
          style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px;"
        />
      </div>

      <h1 style="font-size: 2.5rem; color: #1e293b; margin-top: 0; margin-bottom: 8px;">
        {{ project.title }}
      </h1>
      
      <p v-if="project.categories?.nodes?.length" style="color: #64748b; font-size: 0.95rem; margin-bottom: 24px;">
        <strong>Category:</strong> {{ project.categories.nodes.map(c => c.name).join(', ') }}
      </p>

      <div 
        class="wordpress-content-render" 
        v-html="project.content"
        style="line-height: 1.6; color: #334155; font-size: 1.1rem;"
      ></div>
    </div>

    <div v-else class="error-state">
      <p>Project details could not be found.</p>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { request, gql } from 'graphql-request'

    // 1. Capture the incoming dynamic parameter from router.js automatically
    const props = defineProps({
      slug: {
        type: String,
        required: true
      }
    })

    const endpoint = 'http://localhost:8081/graphql'
    const project = ref(null)
    const loading = ref(true)

    // 2. Query to fetch a singular post filtered by its exact alphanumeric slug
    const GET_PROJECT_BY_SLUG = gql`
      query GetProjectBySlug($slug: ID!) {
        post(id: $slug, idType: SLUG) {
          title
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
          categories {
            nodes {
              name
            }
          }
        }
      }
    `

    onMounted(async () => {
      try {
        // Pass the route parameter straight into our GraphQL variables container
        const variables = { slug: props.slug }
        const data = await request(endpoint, GET_PROJECT_BY_SLUG, variables)
        project.value = data.post
      } catch (error) {
        console.error("Error retrieving detailed post payload:", error)
      } finally {
        loading.value = false
      }
    })
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

.detail-banner-wrapper {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  background: #edf2f7;
}

.detail-banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>