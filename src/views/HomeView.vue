<template>
  <div class="portfolio-container p-6">
    
    <div class="filter-buttons mb-8 flex gap-4 flex-wrap" style="display: flex; gap: 10px; margin-bottom: 20px; position: relative; z-index: 10;">
      <button 
        @click="setCategory(null)" 
        :style="{ backgroundColor: selectedCategory === null ? '#2563eb' : '#e5e7eb', color: selectedCategory === null ? '#fff' : '#000' }"
        style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; transition: all 0.2s;"
      >
        All Projects
      </button>

      <button 
        v-for="category in categories" 
        :key="category.id"
        @click="setCategory(category.slug)"
        :style="{ backgroundColor: selectedCategory === category.slug ? '#2563eb' : '#e5e7eb', color: selectedCategory === category.slug ? '#fff' : '#000' }"
        style="padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; transition: all 0.2s;"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="project-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      <router-link 
        v-for="project in projects" 
        :key="project.id" 
        :to="'/project/' + project.slug"
        style="text-decoration: none; color: inherit; display: block;"
      >
        <div class="project-card" style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff;">
          
          <div class="card-image-wrapper" style="width: 100%; height: 180px; background: #edf2f7; overflow: hidden; position: relative;">
            <img 
              v-if="project.featuredImage?.node?.sourceUrl" 
              :src="project.featuredImage.node.sourceUrl" 
              :alt="project.title"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
            <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e5e7eb; color: #6b7280;">
              <span>No Image Available</span>
            </div>
          </div>

          <div class="card-content" style="padding-top: 15px;">
            <h3 style="margin-top: 0; color: #2c3e50;">{{ project.title }}</h3>
            <div class="meta-details">
              <p v-if="project.categories?.nodes?.length" style="margin: 0; color: #4a5568;">
                <strong>Category:</strong> {{ project.categories.nodes.map(c => c.name).join(', ') }}
              </p>
            </div>
          </div>

        </div>
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request, gql } from 'graphql-request'

const endpoint = 'http://localhost:8081/graphql'

const projects = ref([])
const categories = ref([])
const selectedCategory = ref(null)

const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories(where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
      }
    }
  }
`

const GET_FILTERED_PROJECTS = gql`
  query GetFilteredProjects($categoryName: String) {
    posts(where: { categoryName: $categoryName }) {
      nodes {
        id
        title
        slug
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
  }
`

const fetchProjects = async (categorySlug = null) => {
  try {
    const variables = {}
    if (categorySlug) {
      variables.categoryName = categorySlug
    }
    const data = await request(endpoint, GET_FILTERED_PROJECTS, variables)
    projects.value = data.posts.nodes
  } catch (error) {
    console.error("Error streaming project data from WPGraphQL:", error)
  }
}

onMounted(async () => {
  try {
    const categoryData = await request(endpoint, GET_ALL_CATEGORIES)
    categories.value = categoryData.categories.nodes
  } catch (error) {
    console.error("Error streaming categories:", error)
  }
  await fetchProjects()
})

const setCategory = async (slug) => {
  selectedCategory.value = slug
  await fetchProjects(slug)
}
</script>

<style scoped>
/* Scoped styles can remain here for further custom aesthetic tweaks */
</style>