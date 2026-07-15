<template>
  <div class="max-w-4xl mx-auto px-4 py-12 font-sans">
    
    <!-- Navigation Back Link -->
    <router-link 
      to="/" 
      class="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 no-underline"
    >
      ← Back to Projects
    </router-link>

    <!-- Loading State (Skeleton) -->
    <div v-if="loading" class="animate-pulse bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <div class="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
      <div class="h-10 bg-slate-200 rounded w-3/4 mb-6"></div>
      <div class="space-y-3">
        <div class="h-4 bg-slate-200 rounded"></div>
        <div class="h-4 bg-slate-200 rounded w-5/6"></div>
        <div class="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-100 rounded-2xl p-8 text-rose-800">
      <h2 class="text-xl font-bold mb-2">Failed to load project details</h2>
      <p class="text-sm">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!project" class="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-amber-800">
      <h2 class="text-xl font-bold mb-2">Project Not Found</h2>
      <p class="text-sm">We could not find any project details matching the slug: <code class="font-mono">{{ slug }}</code></p>
    </div>

    <!-- Case Study Layout (Active State) -->
    <article v-else class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <header class="mb-6 pb-6 border-b border-slate-100">
        <div class="flex items-center gap-2 mb-3">
          <span 
            v-for="cat in project.categories?.nodes" 
            :key="cat.name"
            class="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md"
          >
            {{ cat.name }}
          </span>
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2">
          {{ project.title }}
        </h1>
      </header>

      <!-- Render WordPress HTML Content Safely -->
      <section class="prose max-w-none text-slate-600 leading-relaxed" v-html="project.content">
      </section>
    </article>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request, gql } from 'graphql-request'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

// Local states for management
const project = ref(null)
const loading = ref(true)
const error = ref(null)

// Define our WordPress GraphQL Endpoint
const GRAPHQL_ENDPOINT = 'http://localhost:8081/graphql'

const GET_PROJECT_DETAIL = gql`
  query GetProjectDetail($id: ID!) {
    post(id: $id, idType: SLUG) {
      title
      content
      categories {
        nodes {
          name
        }
      }
    }
  }
`

// Fetch data on component mount
onMounted(async () => {
  try {
    const variables = { id: props.slug }
    const response = await request(GRAPHQL_ENDPOINT, GET_PROJECT_DETAIL, variables)
    project.value = response.post
  } catch (err) {
    console.error('GraphQL Fetch Error:', err)
    error.value = 'An error occurred while fetching the data from the headless API.'
  } finally {
    loading.value = false
  }
})
</script>