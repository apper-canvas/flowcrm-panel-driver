import HomePage from '@/components/pages/HomePage';
import ContactsPage from '@/components/pages/ContactsPage';
import PipelinePage from '@/components/pages/PipelinePage';  
import TasksPage from '@/components/pages/TasksPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import SettingsPage from '@/components/pages/SettingsPage';
import CompanyPage from '@/components/pages/CompanyPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
component: ContactsPage
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'GitBranch',
component: PipelinePage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: TasksPage
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
component: AnalyticsPage
  },
companies: {
    id: 'companies',
    label: 'Companies',
    path: '/companies',
    icon: 'Building',
    component: CompanyPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: SettingsPage
  }
};

export const routeArray = Object.values(routes);