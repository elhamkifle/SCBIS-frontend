import Link from "next/link";

const actionImages: Record<string, string> = {
  "New Policy Purchase": "/purchase.png",
  "Submit a Claim": "/Claim.png",
  "Renew Policy": "/Renew.png",
};

const actionLabels = [
  "New Policy Purchase",
  "Submit a Claim",
  "Renew Policy",
] as const;

const actionLinks: Record<typeof actionLabels[number], string> = {
  "New Policy Purchase": "/policy-purchase/personal-information/personalDetails",
  "Submit a Claim": "/claim-submission/vehicle-selection",
  "Renew Policy": "/policy-purchase/personal-information/personalDetails",
};

export default function Dashboard() {
  return (
    <main className="bg-white min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <h1 className="text-4xl font-bold text-blue-500 mb-10 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Hello UserName
        </h1>

        
        <div className="flex flex-row flex-wrap justify-between items-center gap-8 mb-14">
          {actionLabels.map((label) => (
            <Link key={label} href={actionLinks[label]} className="flex-1 min-w-[220px] max-w-[350px]">
              <div
                className="bg-blue-100 rounded-xl shadow-lg shadow-blue-100 h-28 flex flex-col justify-center items-center hover:shadow-xl transition cursor-pointer"
              >
                <img src={actionImages[label]} alt={label} className="w-8 h-8 mb-2" />
                <p className="text-center text-base font-semibold">{label}</p>
              </div>
            </Link>
          ))}
        </div>

       
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-blue-500 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Active Policies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 justify-items-center">
            <div className="bg-white border rounded-xl shadow-lg shadow-blue-100 w-full max-w-[400px] p-8">
              <div className="flex justify-between items-center mb-3">
                <img src="/Private.png" alt="Car" className="w-6 h-6" />
                <span className="text-xs text-green-600 font-semibold">Active</span>
              </div>
              <div className="text-base leading-7">
                <p><span className="text-gray-500">Plate No.:</span> <span className="font-bold">A 12345</span></p>
                <p><span className="text-gray-500">Policy Type:</span> <span className="font-bold">Comprehensive</span></p>
                <p><span className="text-gray-500">Purpose:</span> <span className="font-bold">Private</span></p>
                <p><span className="text-gray-500">Passengers:</span> <span className="font-bold">5 Seater</span></p>
                <p><span className="text-gray-500">Policy Period:</span> <span className="font-bold">01/01/24 - 01/01/25</span></p>
              </div>
              <Link href="/policydetails?id=1">
                <button className="mt-5 w-full text-base text-blue-600 border border-blue-600 rounded py-2 hover:bg-blue-50 font-semibold">
                  View Details
                </button>
              </Link>
            </div>

            <div className="bg-white border rounded-xl shadow-lg shadow-blue-100 w-full max-w-[400px] p-8">
              <div className="flex justify-between items-center mb-3">
                <img src="/Commercial.png" alt="Truck" className="w-6 h-6" />
                <span className="text-xs text-yellow-500 font-semibold">Renewal</span>
              </div>
              <div className="text-base leading-7">
                <p><span className="text-gray-500">Plate No.:</span> <span className="font-bold">A 12345</span></p>
                <p><span className="text-gray-500">Policy Type:</span> <span className="font-bold">Comprehensive</span></p>
                <p><span className="text-gray-500">Purpose:</span> <span className="font-bold">Commercial</span></p>
                <p><span className="text-gray-500">Carrying Cap.:</span> <span className="font-bold">5 Seater</span></p>
                <p><span className="text-gray-500">Policy Period:</span> <span className="font-bold">01/01/24 - 01/01/25</span></p>
              </div>
              <Link href="/policydetails?id=1">
                <button className="mt-5 w-full text-base text-blue-600 border border-blue-600 rounded py-2 hover:bg-blue-50 font-semibold">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-500 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>Claims in progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 justify-items-center">
            <div className="bg-white border rounded-xl shadow-lg shadow-blue-100 w-full max-w-[400px] p-8">
              <div className="flex justify-between items-center mb-3">
                <img src="/Private.png" alt="Car" className="w-6 h-6" />
                <span className="text-xs text-yellow-500 font-semibold">Under Review</span>
              </div>
              <div className="text-base leading-7">
                <p><span className="text-gray-500">Plate No.:</span> <span className="font-bold">A 12345</span></p>
                <p><span className="text-gray-500">Claim Reported On:</span> <span className="font-bold">01/01/24</span></p>
                <p><span className="text-gray-500">Policy Id:</span> <span className="font-bold">P/12345</span></p>
                <p><span className="text-gray-500">Coverage Type:</span> <span className="font-bold">Comprehensive</span></p>
              </div>
              <Link href="/claim-details">
                <button className="mt-5 w-full text-base text-blue-600 border border-blue-600 rounded py-2 hover:bg-blue-50 font-semibold">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
