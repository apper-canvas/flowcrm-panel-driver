import companies from '../mockData/companies.json';

let companyData = [...companies];

export const companyService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...companyData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const company = companyData.find(c => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  async create(companyInput) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCompany = {
      id: Date.now(),
      ...companyInput,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    companyData.push(newCompany);
    return { ...newCompany };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = companyData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    const updatedCompany = {
      ...companyData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    companyData[index] = updatedCompany;
    return { ...updatedCompany };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = companyData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companyData.splice(index, 1);
    return true;
  }
};