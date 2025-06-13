import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';
import { companyService } from '@/services';

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const industryOptions = [
    { value: 'all', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    
    try {
      await companyService.delete(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (editingCompany) {
        const updated = await companyService.update(editingCompany.id, companyData);
        setCompanies(prev => prev.map(c => c.id === editingCompany.id ? updated : c));
        toast.success('Company updated successfully');
      } else {
        const newCompany = await companyService.create(companyData);
        setCompanies(prev => [...prev, newCompany]);
        toast.success('Company created successfully');
      }
      setShowAddModal(false);
      setEditingCompany(null);
    } catch (error) {
      toast.error('Failed to save company');
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.website?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <Text as="h1" className="text-2xl font-heading font-bold text-gray-900 mb-4">Companies</Text>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
            </div>
            
            <Select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              options={industryOptions}
              className="px-3 py-2"
            />
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Building" size={32} className="text-gray-400" />
          </div>
          <Text as="h3" className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery || industryFilter !== 'all' ? 'No companies found' : 'No companies yet'}
          </Text>
          <Text className="text-gray-600 mb-6">
            {searchQuery || industryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first company'
            }
          </Text>
          {!searchQuery && industryFilter === 'all' && (
            <Button
              onClick={() => setShowAddModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3"
            >
              Add Your First Company
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Text as="h3" className="font-semibold text-gray-900 mb-1">{company.name}</Text>
                      <Text className="text-sm text-gray-600 mb-2">{company.industry}</Text>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingCompany(company)}
                        className="p-2 text-gray-600 hover:text-indigo-600"
                        variant="ghost"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        variant="ghost"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {company.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Globe" size={14} className="mr-2" />
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" 
                           className="hover:text-indigo-600 truncate">
                          {company.website}
                        </a>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Phone" size={14} className="mr-2" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    {company.employees && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Users" size={14} className="mr-2" />
                        <span>{company.employees} employees</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {(showAddModal || editingCompany) && (
        <CompanyFormModal
          isOpen={true}
          onClose={() => { setShowAddModal(false); setEditingCompany(null); }}
          company={editingCompany}
          onSave={handleSaveCompany}
          industryOptions={industryOptions}
        />
      )}
    </div>
  );
};

const CompanyFormModal = ({ isOpen, onClose, company, onSave, industryOptions }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: 'technology',
    website: '',
    phone: '',
    email: '',
    address: '',
    employees: '',
    description: ''
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData({
        name: '',
        industry: 'technology',
        website: '',
        phone: '',
        email: '',
        address: '',
        employees: '',
        description: ''
      });
    }
  }, [company]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Text as="h2" className="text-xl font-semibold text-gray-900">
              {company ? 'Edit Company' : 'Add Company'}
            </Text>
            <Button onClick={onClose} variant="ghost" className="p-2">
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Company Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter company name"
              required
            />

            <Select
              label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              options={industryOptions.filter(opt => opt.value !== 'all')}
            />

            <Input
              label="Website"
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              placeholder="company.com"
            />

            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="contact@company.com"
            />

            <Input
              label="Address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="123 Main St, City, State"
            />

            <Input
              label="Number of Employees"
              type="number"
              value={formData.employees}
              onChange={(e) => setFormData({...formData, employees: e.target.value})}
              placeholder="50"
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                {company ? 'Update' : 'Create'} Company
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyPage;