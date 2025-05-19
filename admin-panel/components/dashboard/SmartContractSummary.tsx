// components/dashboard/SmartContractSummary.tsx
export default function SmartContractSummary() {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Smart Contract Summary</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>Balance: 2.7 ETH</li>
          <li>Last Interaction: 2025-04-12 10:13</li>
          <li>Contract Address: 0xAB...12C</li>
        </ul>
      </div>
    );
  }
  