<template>
  <div class="max-w-6xl mx-auto px-4 py-8 font-sans">
    
    <!-- Hero / Header Section -->
    <header class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-2">
        PROJECT WORDPRESS
      </h1>
      <p class="text-lg md:text-xl text-slate-500 italic">
        Decoupled Architecture Showcase
      </p>
      <div class="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
    </header>

    <!-- Navigation / Category Filters -->
    <nav class="flex flex-wrap justify-center gap-2 mb-10" aria-label="Project Categories">
      <button 
        @click="selectCategory(null)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer',
          selectedCategory === null 
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
      >
        All Projects
      </button>
      
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="selectCategory(cat.name)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer',
          selectedCategory === cat.name 
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
      >
        {{ cat.name }}
      </button>
    </nav>

    <!-- MAIN INTERFACE CANVAS -->
    
    <!-- Loading State: Skeleton Loader Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProjectSkeleton v-for="n in 3" :key="n" />
    </div>

    <!-- Active State: Project Grid -->
    <div v-else-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article 
        v-for="project in filteredProjects" 
        :key="project.slug"
        class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
      >
        <!-- Project Image -->
        <div v-if="project.featuredImage" class="h-48 overflow-hidden bg-slate-100 relative">
          <img 
            :src="project.featuredImage.node.sourceUrl" 
            :alt="project.title"
            class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <!-- Fallback standard color block if no image is present -->
        <div v-else class="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <span class="text-slate-400 text-sm font-medium">No Image Available</span>
        </div>

        <!-- Project Content -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-800 mb-2 hover:text-blue-600 transition-colors">
              {{ project.title }}
            </h2>
            
            <!-- Category Badges -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span 
                v-for="cat in project.categories?.nodes" 
                :key="cat.name"
                class="bg-slate-50 text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200"
              >
                Category: {{ cat.name }}
              </span>
            </div>

            <!-- Excerpt -->
            <div 
              class="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3"
              v-html="project.excerpt"
            ></div>
          </div>

          <!-- Navigation Trigger -->
          <router-link 
            :to="{ name: 'ProjectDetail', params: { slug: project.slug } }"
            class="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors duration-200 mt-auto no-underline"
          >
            Explore Technical Details
          </router-link>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl">
      <p class="text-slate-500 font-medium text-lg">No projects found in this category.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { request, gql } from 'graphql-request'
import ProjectSkeleton from '../components/ProjectSkeleton.vue'

const endpoint = 'http://localhost:8081/graphql'

const projects = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const loading = ref(true)

const GET_PORTFOLIO_DATA = gql`
  query GetPortfolioData {
    posts {
      nodes {
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
            id
            name
          }
        }
      }
    }
    categories {
      nodes {
        id
        name
      }
    }
  }
`

onMounted(async () => {
  try {
    const data = await request(endpoint, GET_PORTFOLIO_DATA)
    projects.value = data.posts.nodes
    categories.value = data.categories.nodes.filter(cat => cat.name !== 'Uncategorized')
  } catch (error) {
    console.error("Error fetching repository assets from endpoint:", error)
  } finally {
    // Keep the loading state active for a tiny, simulated duration 
    // to verify skeleton rendering patterns in local environments
    setTimeout(() => {
      loading.value = false
    }, 800)
  }
})

const selectCategory = (categoryName) => {
  selectedCategory.value = categoryName
}

const filteredProjects = computed(() => {
  if (!selectedCategory.value) {
    return projects.value
  }
  return projects.value.filter(project => 
    project.categories?.nodes.some(cat => cat.name === selectedCategory.value)
  )
})
</script>