import communications from '../mockData/communications.json'

const communicationData = [...communications]

export const communicationService = {
  // Get all communications
  getAllCommunications: () => {
    return Promise.resolve(communicationData)
  },

  // Get communication by ID
  getCommunicationById: (id) => {
    const communication = communicationData.find(c => c.id === id)
    return Promise.resolve(communication)
  },

  // Create new communication
  createCommunication: (commData) => {
    const newCommunication = {
      id: Date.now().toString(),
      ...commData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    communicationData.push(newCommunication)
    return Promise.resolve(newCommunication)
  },

  // Update communication
  updateCommunication: (id, updates) => {
    const index = communicationData.findIndex(c => c.id === id)
    if (index !== -1) {
      communicationData[index] = {
        ...communicationData[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return Promise.resolve(communicationData[index])
    }
    return Promise.reject(new Error('Communication not found'))
  },

  // Delete communication
  deleteCommunication: (id) => {
    const index = communicationData.findIndex(c => c.id === id)
    if (index !== -1) {
      const deleted = communicationData.splice(index, 1)[0]
      return Promise.resolve(deleted)
    }
    return Promise.reject(new Error('Communication not found'))
  }
}

export default communicationService
    
    this.communications[index] = updatedCommunication;
    return { ...updatedCommunication };
  }

  async delete(id) {
    await delay(250);
    const index = this.communications.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Communication not found');
    }
    
    this.communications.splice(index, 1);
    return { success: true };
  }
}

export default new CommunicationService();