<template>
  <div class="max-w-6xl mx-auto p-6 font-sans">
    <!-- Main Portfolio Header -->
    <header class="text-center mb-12 border-b border-slate-200 pb-8">
      <h1 class="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">PROJECT WORDPRESS</h1>
      <p class="text-slate-500 italic text-lg">Decoupled Architecture Showcase</p>
    </header>

    <!-- Dynamic Category Filter Tabs -->
    <div v-if="!loading" class="flex flex-wrap gap-3 mb-8">
      <button
        @click="activeCategory = 'all'"
        :class="[
          'px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer',
          activeCategory === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        ]"
      >
        All Projects
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="activeCategory = cat.slug"
        :class="[
          'px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer',
          activeCategory === cat.slug
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Loading State Callback -->
    <div v-if="loading" class="text-center py-12 text-slate-500 font-medium text-lg animate-pulse">
      Retrieving project portfolio nodes from CMS...
    </div>

    <!-- Dynamic Project Grid Mapping -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article 
        v-for="project in filteredProjects" 
        :key="project.id" 
        class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
      >
        <!-- Featured Media Node Presentation -->
        <div v-if="project.featuredImage" class="h-48 overflow-hidden bg-slate-100">
          <img 
            :src="project.featuredImage.node.sourceUrl" 
            :alt="project.title"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{{ project.title }}</h2>
            
            <!-- Category Tag Labels inside Cards -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span 
                v-for="cat in project.categories?.nodes" 
                :key="cat.name"
                class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
              >
                Category: {{ cat.name }}
              </span>
            </div>

            <div 
              class="text-slate-600 text-sm mb-6 line-clamp-3 prose prose-slate" 
              v-html="project.excerpt"
            ></div>
          </div>

          <!-- Router Redirection Anchor -->
          <router-link 
            :to="{ name: 'ProjectDetail', params: { slug: project.slug } }"
            class="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 no-underline text-sm mt-auto"
          >
            Explore Technical Details
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { request, gql } from 'graphql-request'

const endpoint = 'http://localhost:8081/graphql'
const projects = ref([])
const categories = ref([])
const activeCategory = ref('all')
const loading = ref(true)

const GET_PORTFOLIO_DATA = gql`
  query GetPortfolioData {
    posts {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
    categories {
      nodes {
        id
        name
        slug
      }
    }
  }
`

// Computed property to calculate filtered items reactively
const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') {
    return projects.value
  }
  return projects.value.filter(project => 
    project.categories?.nodes?.some(cat => cat.slug === activeCategory.value)
  )
})

onMounted(async () => {
  try {
    const data = await request(endpoint, GET_PORTFOLIO_DATA)
    projects.value = data.posts.nodes
    
    // Filter out default 'Uncategorized' slug from WordPress to keep the filter UI clean
    categories.value = data.categories.nodes.filter(cat => cat.slug !== 'uncategorized')
  } catch (error) {
    console.error("Failed to query records from endpoints:", error)
  } finally {
    loading.value = false
  }
})
</script>