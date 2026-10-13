import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import {
  EnterpriseBusiness,
  EnterpriseEmployee,
  getStoredEnterpriseBusinesses,
  saveCustomBusiness,
} from '../services/enterpriseTenants';
import { api } from '../services/api';

export interface CreateOrganizationInput {
  name: string;
  industry?: string;
  plan?: string;
  color?: string;
  tagline?: string;
  admin: {
    fullName: string;
    email: string;
    role?: UserRole;
    departmentName?: string;
    title?: string;
  };
}

interface AuthContextType {
  currentBusiness: EnterpriseBusiness;
  currentUser: EnterpriseEmployee;
  currentRole: UserRole;
  switchBusiness: (businessId: string) => void;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updates: Partial<EnterpriseEmployee>) => void;
  createNewOrganization: (input: CreateOrganizationInput) => Promise<EnterpriseBusiness>;
  allBusinesses: EnterpriseBusiness[];
  allUsers: EnterpriseEmployee[];
  isClient: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BIZ_STORAGE_KEY = 'ENTREPRISE_ACTIVE_ORG_ID';
const USER_STORAGE_KEY = 'ENTREPRISE_ACTIVE_USER_ID';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<EnterpriseBusiness[]>(() => {
    return getStoredEnterpriseBusinesses();
  });

  const [currentBusiness, setCurrentBusiness] = useState<EnterpriseBusiness>(() => {
    const all = getStoredEnterpriseBusinesses();
    try {
      const savedOrgId = localStorage.getItem(BIZ_STORAGE_KEY);
      if (savedOrgId) {
        const found = all.find(b => b.id === savedOrgId);
        if (found) return found;
      }
    } catch (e) {
      // fallback
    }
    return all[0]; // Apex Cloud Tech default
  });

  const [currentUser, setCurrentUser] = useState<EnterpriseEmployee>(() => {
    const all = getStoredEnterpriseBusinesses();
    try {
      const savedUserId = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUserId) {
        for (const biz of all) {
          const u = biz.employees.find(e => e.id === savedUserId);
          if (u) return u;
        }
      }
    } catch (e) {
      // fallback
    }
    return all[0].employees[0]; // Alex Rivers default
  });

  // Keep businesses in sync with backend
  useEffect(() => {
    api.getOrganizations().then(backendOrgs => {
      if (Array.isArray(backendOrgs) && backendOrgs.length > 0) {
        setBusinesses(prev => {
          const prevMap = new Map(prev.map(b => [b.id, b]));
          backendOrgs.forEach((bo: any) => {
            if (!prevMap.has(bo.id)) {
              const employees: EnterpriseEmployee[] = (bo.employees || []).map((e: any) => ({
                id: e.id,
                name: e.fullName || e.name || 'Admin',
                email: e.email,
                role: (e.role?.toUpperCase() || 'OWNER') as UserRole,
                title: 'Organization Owner',
                department: bo.departments?.[0]?.name || 'Operations',
                avatar: e.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                passwordHint: 'enterprise',
              }));

              const newBiz: EnterpriseBusiness = {
                id: bo.id,
                name: bo.name,
                slug: bo.slug,
                tagline: 'Enterprise Operations Workspace',
                industry: 'Enterprise Operations',
                plan: bo.plan || 'Enterprise Tier',
                logoLetter: bo.name.charAt(0).toUpperCase(),
                color: bo.departments?.[0]?.color || '#0F4C3A',
                employees: employees.length > 0 ? employees : [
                  {
                    id: `usr-${bo.id}-1`,
                    name: 'Admin',
                    email: `admin@${bo.slug}.com`,
                    role: 'OWNER',
                    title: 'Owner',
                    department: 'Operations',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    passwordHint: 'enterprise',
                  }
                ],
              };
              prevMap.set(bo.id, newBiz);
            }
          });
          return Array.from(prevMap.values());
        });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BIZ_STORAGE_KEY, currentBusiness.id);
      localStorage.setItem(USER_STORAGE_KEY, currentUser.id);
      api.setOrganization(currentBusiness.id);
    } catch (e) {
      // ignore
    }
  }, [currentBusiness, currentUser]);

  const switchBusiness = (businessId: string) => {
    const biz = businesses.find(b => b.id === businessId);
    if (biz) {
      setCurrentBusiness(biz);
      setCurrentUser(biz.employees[0]); // Default to Owner of that business
      api.setOrganization(biz.id);
      window.dispatchEvent(new CustomEvent('ENTERPRISE_ORG_CHANGED', { detail: { orgId: biz.id } }));
    }
  };

  const switchUser = (userId: string) => {
    for (const biz of businesses) {
      const user = biz.employees.find(e => e.id === userId);
      if (user) {
        setCurrentBusiness(biz);
        setCurrentUser(user);
        api.setOrganization(biz.id);
        window.dispatchEvent(new CustomEvent('ENTERPRISE_ORG_CHANGED', { detail: { orgId: biz.id } }));
        return;
      }
    }
  };

  const switchRole = (role: UserRole) => {
    const found = currentBusiness.employees.find(e => e.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateCurrentUserProfile = (updates: Partial<EnterpriseEmployee>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  /**
   * Creates a new organization, adds it to state & database, and logs in immediately as the new person
   */
  const createNewOrganization = async (input: CreateOrganizationInput): Promise<EnterpriseBusiness> => {
    // 1. Call backend API
    const response = await api.createOrganization(input);
    const orgData = response?.data?.organization;
    const profileData = response?.data?.profile;
    const deptData = response?.data?.department;

    const orgId = orgData?.id || `org-${Date.now().toString(36)}`;
    const empId = profileData?.id || `usr-${Date.now().toString(36)}`;

    const newEmployee: EnterpriseEmployee = {
      id: empId,
      name: input.admin.fullName,
      email: input.admin.email,
      role: (input.admin.role || 'OWNER') as UserRole,
      title: input.admin.title || 'Founder & CEO',
      department: deptData?.name || input.admin.departmentName || 'Operations & Leadership',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      passwordHint: 'enterprise',
      status: 'ACTIVE',
    };

    const newBusiness: EnterpriseBusiness = {
      id: orgId,
      name: input.name,
      slug: orgData?.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: input.tagline || `${input.industry || 'Enterprise'} Operations`,
      industry: input.industry || 'Technology & Operations',
      plan: input.plan || 'Enterprise Tier',
      logoLetter: input.name.charAt(0).toUpperCase(),
      color: input.color || '#0F4C3A',
      employees: [newEmployee],
    };

    // 2. Save in localStorage and state
    const updated = saveCustomBusiness(newBusiness);
    setBusinesses(updated);

    // 3. Switch immediately and login as new person
    setCurrentBusiness(newBusiness);
    setCurrentUser(newEmployee);
    api.setOrganization(newBusiness.id);

    try {
      localStorage.setItem(BIZ_STORAGE_KEY, newBusiness.id);
      localStorage.setItem(USER_STORAGE_KEY, newEmployee.id);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('ENTERPRISE_ORG_CHANGED', { detail: { orgId: newBusiness.id } }));

    return newBusiness;
  };

  const isClient = currentUser.role === 'CLIENT';
  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'OWNER';

  return (
    <AuthContext.Provider
      value={{
        currentBusiness,
        currentUser,
        currentRole: currentUser.role,
        switchBusiness,
        switchUser,
        switchRole,
        updateCurrentUserProfile,
        createNewOrganization,
        allBusinesses: businesses,
        allUsers: currentBusiness.employees,
        isClient,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
