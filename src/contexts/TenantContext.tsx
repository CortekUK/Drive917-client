'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTenant();
  }, []);

  const loadTenant = async () => {
    try {
      setLoading(true);
      setError(null);

      // Extract subdomain from hostname (client-side only)
      if (typeof window === 'undefined') {
        setTenant(null);
        setLoading(false);
        return;
      }

      const hostname = window.location.hostname;
      const subdomain = extractSubdomain(hostname);

      if (!subdomain) {
        // No subdomain means main site (no tenant context needed for booking)
        setTenant(null);
        setLoading(false);
        return;
      }

      // Fetch tenant by subdomain slug
      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('id, slug, company_name, status, contact_email')
        .eq('slug', subdomain)
        .eq('status', 'active')
        .single();

      if (fetchError) {
        console.error('Error loading tenant:', fetchError);
        setError('Tenant not found or inactive');
        setTenant(null);
      } else {
        setTenant(data);
      }
    } catch (err: any) {
      console.error('Error in loadTenant:', err);
      setError(err.message || 'Failed to load tenant');
      setTenant(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

/**
 * Extract subdomain from hostname
 * Examples:
 * - "acme.localhost" -> "acme"
 * - "acme.drive-247.com" -> "acme"
 * - "localhost" -> null
 * - "drive-247.com" -> null
 * - "www.drive-247.com" -> null
 */
function extractSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];
  const parts = host.split('.');

  // Handle localhost: "acme.localhost" -> "acme"
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0] !== 'localhost' ? parts[0] : null;
  }

  // Handle production: "acme.drive-247.com" -> "acme"
  // Must have at least 3 parts (subdomain.domain.tld)
  // Exclude common non-tenant subdomains like "www" and "admin"
  if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'admin') {
    return parts[0];
  }

  return null;
}
