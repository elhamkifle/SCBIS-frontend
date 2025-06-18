"use client";
import { useWallet } from "@/lib/blockchain/context/WalletContext";
import { useUserPolicies,Claim } from "@/lib/blockchain/useUserPolicies";


export default function MyPoliciesPage() {

    
    
    
    const { connectWallet, isConnected } = useWallet();
    const { policies, loading } = useUserPolicies();
    // const [loading, setLoading] = useState<boolean>(true);

    // const [policies, setPolicies] = useState<Policy[] | undefined>([]);
    const formatDate = (timestamp: bigint | number | string) => {
    const ms = typeof timestamp === "bigint"
        ? Number(timestamp) * 1000
        : parseInt(timestamp.toString()) * 1000;

    const date = new Date(ms);
        return date.toLocaleString(); // or toLocaleDateString() for just the date
    };

    
    // useEffect(() => {
    //    const fetchPolicies = async () => {
    //     const fetchedResults = await getMyPolicies();
    //     if (!fetchedResults) {
    //         console.error("No policies found or error fetching policies.");
    //     }
    //     else setPolicies(fetchedResults);

    //     setLoading(false);
    //    }

    //    fetchPolicies()
    // },[]);
    

    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📑 My Insurance Policies</h1>

        {/* {!walletAddress && <p className="text-gray-500">Connect wallet to view policies.</p>} */}

        { !isConnected ? (
        <div className="mt-4">
          <p className="text-red-500">Wallet not connected. To access this page you need to connect your Metamask account.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>) : loading ? (
            <p>Loading...</p>
        ) : policies!.length === 0 ? (
            <p>No policies found.</p>
        ) : (
            <ul className="space-y-4">
            {policies!.map((p, idx) => (
                <li key={idx} className="p-4 border rounded shadow-sm">
                <p><strong>ID:</strong> {p.policyId}</p>
                <p><strong>Type:</strong> {p.policyType}</p>
                <p><strong>Premium:</strong> {p.premiumAmount} ETB</p>
                <p><strong>Coverage:</strong> {p.coverageArea}</p>
                <p><strong>Start:</strong> {formatDate(p.policyStartDate)}</p>
                <p><strong>End:</strong> {formatDate(p.policyEndDate)}</p>
                <p><strong>Active:</strong> {p.isActive ? "Yes" : "No"}</p>
                <p><strong>Claims:</strong> </p>

                <div>
                    <ul className="list-disc pl-6">
                    {p.claims && p.claims.length > 0 ? (
                        p.claims.map((claim:Claim, index:any) => (
                            <li key={index}>
                                <p><strong>Claim ID:</strong> {claim.claimId}</p>
                                <p><strong>Status:</strong> {claim.isApproved? "Approved": "Pending"}</p>
                                <p><strong>Driver Name:</strong> {claim.driverName}</p>
                                <p><strong>Amount Claimed:</strong> {claim.amountClaimed} ETB</p>
                                <p><strong>Amount Approved:</strong> {claim.amountApproved} ETB</p>
                                <p><strong>Accident Type:</strong> {claim.accidenteType}</p>
                                <p><strong>Proforma:</strong> {claim.proforma}</p>
                                <p><strong>Medical Records:</strong> {claim.medicalrecords}</p>
                                <p><strong>Claim Submission Date:</strong> {formatDate(claim.claimSubmissionDate)}</p>
                                <p><strong>Claim Approval Date:</strong> {formatDate(claim.claimSubmissionDate)}</p>
                            </li>
                        ))
                    ) : (
                        <li>No claims made for this policy.</li>
                    )}
                    </ul>
                </div>


                </li>
            ))}
            </ul>
        )}
        </div>
    );
}
