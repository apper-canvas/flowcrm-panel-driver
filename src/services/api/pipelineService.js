import pipelineData from '../mockData/pipeline.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PipelineService {
  constructor() {
    this.pipeline = [...pipelineData];
  }

  async getAll() {
    await delay(200);
    return [...this.pipeline];
  }

  async getById(id) {
    await delay(150);
    const stage = this.pipeline.find(p => p.id === id);
    if (!stage) {
      throw new Error('Pipeline stage not found');
    }
    return { ...stage };
  }

  async create(pipelineData) {
    await delay(300);
    const newStage = {
      ...pipelineData,
      id: Date.now().toString(),
      order: this.pipeline.length
    };
    this.pipeline.push(newStage);
    return { ...newStage };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.pipeline.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Pipeline stage not found');
    }
    
    const updatedStage = {
      ...this.pipeline[index],
      ...updates
    };
    
    this.pipeline[index] = updatedStage;
    return { ...updatedStage };
  }

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