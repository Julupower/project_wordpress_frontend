<template>
  <div class="max-w-4xl mx-auto p-6 font-sans">
    <!-- Router Back Navigation Action -->
    <div class="mb-8">
      <router-link 
        to="/" 
        class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 no-underline transition-colors duration-200"
      >
        ← Back to Portfolio Grid
      </router-link>
    </div>

    <!-- Loading State Feedback -->
    <div v-if="loading" class="text-center py-12 text-slate-500 font-medium text-lg animate-pulse">
      Loading asset structural specifications...
    </div>

    <!-- Main Project Canvas -->
    <article v-else-if="project" class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6 md:p-8">
      <header class="mb-6">
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
          {{ project.title }}
        </h1>
        
        <!-- Categorization Metadata Badges -->
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="cat in project.categories?.nodes" 
            :key="cat.name"
            class="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100"
          >
            {{ cat.name }}
          </span>
        </div>
      </header>

      <!-- Optimized Presentation Media Render -->
      <div v-if="project.featuredImage" class="w-full max-h-[450px] overflow-hidden rounded-xl bg-slate-100 mb-8 shadow-inner">
        <img 
          :src="project.featuredImage.node.sourceUrl" 
          :alt="project.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Decoupled Body Content Container -->
      <div 
        class="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4"
        v-html="project.content"
      ></div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request, gql } from 'graphql-request'
import { useRouter } from 'vue-router'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const router = useRouter()
const endpoint = 'http://localhost:8081/graphql'
const project = ref(null)
const loading = ref(true)

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
    const variables = { slug: props.slug }
    const data = await request(endpoint, GET_PROJECT_BY_SLUG, variables)
    
    if (!data.post) {
      router.replace({ name: 'NotFound' })
      return
    }
    
    project.value = data.post
  } catch (error) {
    console.error("Error retrieving detailed post payload:", error)
    router.replace({ name: 'NotFound' })
  } finally {
    loading.value = false
  }
})
</script>