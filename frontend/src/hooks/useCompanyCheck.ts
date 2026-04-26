import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { companyService } from "../services/company";

export const useCompanyCheck = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["company-profile"],
    queryFn: () => companyService.getCompanyProfile(),
    enabled: user?.role === "COMPANY",
    retry: false,
  });

  const isCompanyRegistered = data?.success && data?.data;
  const needsRegistration =
    user?.role === "COMPANY" && !isCompanyRegistered && !isLoading;

  return {
    company: data?.data,
    isCompanyRegistered,
    needsRegistration,
    isLoading,
    error,
  };
};
