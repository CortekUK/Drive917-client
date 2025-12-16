'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface Tenant {
  id: string;
  slug: string;
  company_name: string;
  status: string;
  contact_email: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    loadTenant();
  }, []);

  const loadTenant = async () => {
    // NOTE: Drive917-client (customer portal) doesn't have multi-tenant support
    // The tenants table only exists in vexa-portal-1 (admin portal)
    // Always return null for tenant in customer portal
    setTenant(null);
    setLoading(false);
  };

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);

  // Return safe defaults during SSR or when provider is not mounted
  // This prevents errors during Next.js server-side rendering
  if (context === undefined) {
    return {
      tenant: null,
      loading: false,
      error: null
    };
  }

  return context;
}
