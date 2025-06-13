import communicationsData from '../mockData/communications.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommunicationService {
  constructor() {
    this.communications = [...communicationsData];
  }

  async getAll() {
    await delay(250);
    return [...this.communications];
  }

  async getById(id) {
    await delay(200);
    const communication = this.communications.find(c => c.id === id);
    if (!communication) {
      throw new Error('Communication not found');
    }
    return { ...communication };
  }

  async getByContactId(contactId) {
    await delay(300);
    return this.communications.filter(c => c.contactId === contactId).map(c => ({ ...c }));
  }

  async create(communicationData) {
    await delay(400);
    const newCommunication = {
      ...communicationData,
      id: Date.now().toString(),
      date: communicationData.date || new Date().toISOString()
    };
    this.communications.unshift(newCommunication);
    return { ...newCommunication };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.communications.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Communication not found');
    }
    
    const updatedCommunication = {
      ...this.communications[index],
      ...updates
    };
    
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