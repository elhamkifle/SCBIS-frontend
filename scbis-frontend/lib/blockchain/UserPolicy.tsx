'use client'
import { useWallet } from "@/lib/blockchain/context/WalletContext";
import { useUserPolicies } from "@/lib/blockchain/useUserPolicies";

export default function UserPoliciesPage() {
  const { connectWallet, isConnected } = useWallet();
  const { policies, loading } = useUserPolicies();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📑 My Insurance Policies</h1>

      {!isConnected ? (
        <div className="mt-4">
          <p className="text-red-500">🔌 Wallet not connected.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      ) : loading ? (
        <p className="mt-4">⏳ Loading policies...</p>
      ) : policies.length === 0 ? (
        <p className="mt-4">No policies found.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {policies.map((policy, index) => (
            <div key={index} className="border p-4 rounded bg-gray-50 shadow">
              <h2 className="font-semibold text-lg">
                🆔 {policy.policyId} - {policy.policyType}
              </h2>
              <p>📅 Start: {policy.policyStartDate}</p>
              <p>📅 End: {policy.policyEndDate}</p>
              <p>💰 Premium: {policy.premiumAmount}</p>
              <p>📍 Coverage: {policy.coverageArea}</p>

              {policy.claims.length > 0 && (
                <div className="mt-2">
                  <strong>Claims:</strong>
                  <ul className="list-disc ml-5">
                    {policy.claims.map((c: any, i: number) => (
                      <li key={i}>
                        ID: {c.claimId}, Claimed: {c.amountClaimed}, Approved:{" "}
                        {c.amountApproved}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
