<script setup>
import { ref, onMounted, watch } from 'vue'
import { request, gql } from 'graphql-request'
import { useSEO } from '../composables/useSEO'

// Reactive state
const projects = ref([])
const categories = ref([])
const selectedCategory = ref('ALL')
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(null)

// Pagination state
const hasNextPage = ref(false)
const endCursor = ref(null)
const PAGE_SIZE = 3

// Dynamic SEO initialization
useSEO('Portfolio Case Studies', 'Explore technical case studies and full-stack software development projects.')

const GRAPHQL_ENDPOINT = 'http://localhost:8081/graphql'

// GraphQL Query with Cursor-Based Pagination Parameters
const GET_PROJECTS_AND_CATEGORIES = gql`
  query GetProjectsAndCategories($categoryName: String, $first: Int, $after: String) {
    categories {
      nodes {
        id
        name
        slug
      }
    }
    posts(where: { categoryName: $categoryName }, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        slug
        excerpt
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
  }
`

// Fetch data function supporting initial load and append pagination
const fetchData = async (isLoadMore = false) => {
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
    projects.value = []
    endCursor.value = null
  }
  
  error.value = null

  try {
    const variables = {
      categoryName: selectedCategory.value === 'ALL' ? null : selectedCategory.value,
      first: PAGE_SIZE,
      after: isLoadMore ? endCursor.value : null
    }
    
    const response = await request(GRAPHQL_ENDPOINT, GET_PROJECTS_AND_CATEGORIES, variables)
    
    // Update categories on initial load
    if (!isLoadMore) {
      categories.value = response.categories?.nodes || []
    }

    const fetchedPosts = response.posts?.nodes || []
    const pageInfo = response.posts?.pageInfo || {}

    // Append posts if loading more, otherwise set array
    projects.value = isLoadMore ? [...projects.value, ...fetchedPosts] : fetchedPosts
    
    // Update pagination pointers
    hasNextPage.value = pageInfo.hasNextPage || false
    endCursor.value = pageInfo.endCursor || null
  } catch (err) {
    console.error('GraphQL Error:', err)
    error.value = 'Failed to load projects. Ensure the GraphQL endpoint is operational.'
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// Reset pagination and re-fetch when category filter changes
watch(selectedCategory, () => {
  fetchData(false)
})

onMounted(() => {
  fetchData(false)
})
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 py-12">
    <!-- Header Section -->
    <header class="mb-10 text-center">
      <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Engineered Solutions & Case Studies
      </h1>
      <p class="text-slate-600 max-w-2xl mx-auto">
        Filter through architectural case studies and full-stack enterprise applications built with modern frontend and backend frameworks.
      </p>
    </header>

    <!-- Category Filter Bar -->
    <div class="flex flex-wrap items-center justify-center gap-2 mb-10">
      <button
        @click="selectedCategory = 'ALL'"
        :class="[
          'px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200',
          selectedCategory === 'ALL'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        All Projects
      </button>

      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectedCategory = category.slug"
        :class="[
          'px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200',
          selectedCategory === category.slug
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- State 1: Skeleton Loader -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
        <div class="h-48 bg-slate-200 rounded-lg mb-4"></div>
        <div class="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div class="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
    </div>

    <!-- State 2: Error UI -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
      <p class="text-red-600 font-medium mb-4">{{ error }}</p>
      <button @click="fetchData(false)" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm">
        Retry
      </button>
    </div>

    <!-- State 3: Empty State -->
    <div v-else-if="projects.length === 0" class="text-center py-16 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
      <p class="text-slate-500 font-medium text-lg">No projects found for this category filter.</p>
    </div>

    <!-- State 4: Project Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="project in projects" 
          :key="project.id" 
          class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <div v-if="project.featuredImage?.node" class="h-48 overflow-hidden bg-slate-100 border-b border-slate-100">
            <img 
              :src="project.featuredImage.node.sourceUrl" 
              :alt="project.featuredImage.node.altText || project.title"
              class="w-full h-full object-cover"
            />
          </div>
          
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <span 
                  v-for="cat in project.categories?.nodes" 
                  :key="cat.name"
                  class="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded"
                >
                  {{ cat.name }}
                </span>
              </div>
              <h2 class="text-xl font-bold text-slate-800 mb-2">
                {{ project.title }}
              </h2>
              <div 
                class="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3" 
                v-html="project.excerpt"
              ></div>
            </div>

            <router-link 
              :to="`/project/${project.slug}`"
              class="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-4"
            >
              View Technical Case Study &rarr;
            </router-link>
          </div>
        </article>
      </div>

      <!-- Pagination Load More Control -->
      <div v-if="hasNextPage" class="mt-12 text-center">
        <button
          @click="fetchData(true)"
          :disabled="loadingMore"
          class="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 inline-flex items-center gap-2"
        >
          <span v-if="loadingMore" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ loadingMore ? 'Fetching Records...' : 'Load More Projects' }}</span>
        </button>
      </div>
    </div>
  </main>
</template>