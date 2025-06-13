import contacts from '../mockData/contacts.json'

const contactData = [...contacts]

export const contactService = {
  // Get all contacts
  getAllContacts: () => {
    return Promise.resolve(contactData)
  },

  // Get contact by ID
  getContactById: (id) => {
    const contact = contactData.find(c => c.id === id)
    return Promise.resolve(contact)
  },

  // Create new contact
  createContact: (contactInfo) => {
    const newContact = {
      id: Date.now().toString(),
      ...contactInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    contactData.push(newContact)
    return Promise.resolve(newContact)
  },

  // Update contact
  updateContact: (id, updates) => {
    const index = contactData.findIndex(c => c.id === id)
    if (index !== -1) {
      contactData[index] = {
        ...contactData[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return Promise.resolve(contactData[index])
    }
    return Promise.reject(new Error('Contact not found'))
  },

  // Delete contact
  deleteContact: (id) => {
    const index = contactData.findIndex(c => c.id === id)
    if (index !== -1) {
      const deleted = contactData.splice(index, 1)[0]
      return Promise.resolve(deleted)
    }
    return Promise.reject(new Error('Contact not found'))
  }
}

export default contactService
  }

  async delete(id) {
    await delay(250);
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    this.contacts.splice(index, 1);
    return { success: true };
  }
}

export default new ContactService();