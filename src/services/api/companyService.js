import companies from '../mockData/companies.json'

const companyData = [...companies]

export const companyService = {
  // Get all companies
  getAllCompanies: () => {
    return Promise.resolve(companyData)
  },

  // Get company by ID
  getCompanyById: (id) => {
    const company = companyData.find(c => c.id === id)
    return Promise.resolve(company)
  },

  // Create new company
  createCompany: (companyData) => {
    const newCompany = {
      id: Date.now().toString(),
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    companyData.push(newCompany)
    return Promise.resolve(newCompany)
  },

  // Update company
  updateCompany: (id, updates) => {
    const index = companyData.findIndex(c => c.id === id)
    if (index !== -1) {
      companyData[index] = {
        ...companyData[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return Promise.resolve(companyData[index])
    }
    return Promise.reject(new Error('Company not found'))
  },

  // Delete company
  deleteCompany: (id) => {
    const index = companyData.findIndex(c => c.id === id)
    if (index !== -1) {
      const deleted = companyData.splice(index, 1)[0]
      return Promise.resolve(deleted)
    }
    return Promise.reject(new Error('Company not found'))
  }
}

export default companyService
      throw new Error('Company not found');
    }
    companyData.splice(index, 1);
    return true;
  }
};