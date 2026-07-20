<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Navigation Back Link -->
    <router-link 
      to="/" 
      class="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8 transition-colors"
    >
      &larr; Back to Projects
    </router-link>

    <!-- State 1: Skeleton Loader -->
    <div v-if="loading" class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm animate-pulse">
      <div class="h-6 w-24 bg-slate-200 rounded mb-4"></div>
      <div class="h-10 w-3/4 bg-slate-200 rounded mb-6"></div>
      <div class="h-64 bg-slate-200 rounded-xl mb-6"></div>
      <div class="space-y-3">
        <div class="h-4 bg-slate-200 rounded w-full"></div>
        <div class="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>

    <!-- State 2: Error / Server Downtime Fallback UI -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-slate-800 mb-2">Unable to Retrieve Project Details</h2>
      <p class="text-sm text-slate-600 max-w-md mx-auto mb-6">
        {{ error }}
      </p>
      <button 
        @click="fetchProjectData" 
        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
      >
        Retry Connection
      </button>
    </div>

    <!-- State 3: Active Case Study Layout -->
    <article v-else-if="project" class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
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

      <div v-if="project.featuredImage?.node" class="mb-8 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <img 
          :src="project.featuredImage.node.sourceUrl" 
          :alt="project.featuredImage.node.altText || project.title"
          class="w-full h-auto max-h-[450px] object-cover block"
        />
      </div>

      <section class="max-w-none text-slate-700 leading-relaxed space-y-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2" v-html="project.content">
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request, gql } from 'graphql-request'
import { useSEO } from '../composables/useSEO'

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

// Register Dynamic SEO Hook
//Declaring useSEO right below the ref() variables ensures that the composable instantly hooks into project.value. As soon as onMounted fetches the data and assigns it to project.value, 
//the watchEffect inside useSEO triggers automatically and updates your browser tab title.
useSEO(
  () => project.value?.title || 'Loading Project...',
  () => project.value?.content ? project.value.content.replace(/(<([^>]+)>)/gi, "").substring(0, 160) : 'Technical project specification and architectural case study.'
)

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
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`

// Fetch data on component mount
onMounted(async () => 
{
    try 
    {
        const variables = { id: props.slug }
        const response = await request(GRAPHQL_ENDPOINT, GET_PROJECT_DETAIL, variables)
            project.value = response.post
    } 
    catch (err) 
    {
        console.error('GraphQL Fetch Error:', err)
        error.value = 'An error occurred while fetching the data from the headless API.'
    } 
    finally 
    {
        loading.value = false
    }
})

// Function to handle asynchronous API request
const fetchProjectData = async () => {
  loading.value = true
  error.value = null

  try {
    const variables = { id: props.slug }
    const response = await request(GRAPHQL_ENDPOINT, GET_PROJECT_DETAIL, variables)
    
    if (!response.post) {
      error.value = 'The requested project resource could not be found.'
      return
    }

    project.value = response.post
  } catch (err) {
    console.error('GraphQL Fetch Error:', err)
    error.value = 'Network error or server unavailable. Please verify API connection.'
  } finally {
    loading.value = false
  }
}

// Trigger initial fetch on component mount
onMounted(() => {
  fetchProjectData()
})
</script>