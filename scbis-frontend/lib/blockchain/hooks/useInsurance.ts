import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getInsuranceContract } from "@/lib/blockchain/contract";

export function useInsurance(signer: ethers.Signer | null) {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (timestamp: any) =>
    new Date(Number(timestamp) * 1000).toLocaleDateString();

  const fetchPolicies = async () => {
    if (!signer) return console.warn("Signer not available, cannot fetch policies.");
    setLoading(true);

    try {
      const contract = getInsuranceContract(signer);
      console.log("🔗 Fetching policies from contract:", contract.address);
      const result = await contract.getMyPolicies();
      console.log("📜 Policies fetched:", result,typeof(result));
      const formatted = result.map((p: any) => ({
        policyId: p.policyId,
        policyType: p.policyType,
        premiumAmount: ethers.formatEther(p.premiumAmount),
        coverageArea: p.coverageArea,
        startDate: formatDate(p.policyStartDate),
        endDate: formatDate(p.policyEndDate),
        isActive: p.isActive,
        claims: p.claims.length,
      }));

      setPolicies(formatted);
    } catch (err) {
      console.error("❌ Error fetching policies:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPolicies();
  }, [signer]);

  return { policies, loading, refetch: fetchPolicies };
}
