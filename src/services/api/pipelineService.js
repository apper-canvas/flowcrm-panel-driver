import pipeline from '../mockData/pipeline.json'

const pipelineData = [...pipeline]

export const pipelineService = {
  // Get all pipeline stages
  getAllStages: () => {
    return Promise.resolve(pipelineData)
  },

  // Get stage by ID
  getStageById: (id) => {
    const stage = pipelineData.find(s => s.id === id)
    return Promise.resolve(stage)
  },

  // Create new stage
  createStage: (stageData) => {
    const newStage = {
      id: Date.now().toString(),
      ...stageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    pipelineData.push(newStage)
    return Promise.resolve(newStage)
  },

  // Update stage
  updateStage: (id, updates) => {
    const index = pipelineData.findIndex(s => s.id === id)
    if (index !== -1) {
      pipelineData[index] = {
        ...pipelineData[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return Promise.resolve(pipelineData[index])
    }
    return Promise.reject(new Error('Stage not found'))
  },

  // Delete stage
  deleteStage: (id) => {
    const index = pipelineData.findIndex(s => s.id === id)
    if (index !== -1) {
      const deleted = pipelineData.splice(index, 1)[0]
      return Promise.resolve(deleted)
    }
    return Promise.reject(new Error('Stage not found'))
  }
}

export default pipelineService
  async delete(id) {
    await delay(200);
    const index = this.pipeline.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pipeline stage not found');
    }
    
    this.pipeline.splice(index, 1);
    return { success: true };
  }
}

export default new PipelineService();