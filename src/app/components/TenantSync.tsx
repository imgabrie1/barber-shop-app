import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { setTenant } from "@/services/auth.storage";

export const TenantSync = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  useEffect(() => {
    if (tenantSlug) {
      setTenant(tenantSlug);
    }
  }, [tenantSlug]);

  return <Outlet />;
};
