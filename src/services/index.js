import contactService from '@/services/api/contactService'
import pipelineService from '@/services/api/pipelineService'
import taskService from '@/services/api/taskService'
import communicationService from '@/services/api/communicationService'
import companyService from '@/services/api/companyService'

export {
  contactService,
  pipelineService,
  taskService,
  communicationService,
  companyService
}

// Re-export as named exports for compatibility
export { 
  contactService, 
  pipelineService, 
  taskService, 
  communicationService, 
  companyService 
}

// Re-export as default for direct imports
export default {
  contactService,
  pipelineService,
  taskService,
  communicationService,
  companyService
}