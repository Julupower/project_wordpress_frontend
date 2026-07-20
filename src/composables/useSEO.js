import { watchEffect } from 'vue'

/**
 * Custom Composable for dynamic Document Metadata management.
 * @param {Function|Object} title - Reactive getter or string for page title
 * @param {Function|Object} description - Reactive getter or string for meta description
 */
export function useSEO(title, description) 
{
  watchEffect(() => 
  {
    // Resolve dynamic values if passed as reactive getters or refs
    const resolvedTitle = typeof title === 'function' ? title() : title
    const resolvedDesc = typeof description === 'function' ? description() : description

    // Update Browser Tab Title
    if (resolvedTitle) 
    {
      document.title = `${resolvedTitle} | Enterprise Portfolio`
    }

    // Update Meta Description
    if (resolvedDesc) 
    {
      let metaDescription = document.querySelector('meta[name="description"]')
      
      // If meta description tag does not exist in head, create it programmatically
      if (!metaDescription) 
      {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      
      metaDescription.setAttribute('content', resolvedDesc)
    }
  })
}