// app/faq/page.tsx

const faqs = [
  {
    question: "What is a Smart Contract-Based Insurance System?",
    answer:
      "It is a decentralized platform that uses blockchain smart contracts to automate the management of insurance policies and claims. It ensures transparency, trust, and tamper-proof execution without middlemen.",
  },
  {
    question: "How does the claims process work?",
    answer:
      "Claims are submitted by policyholders and verified automatically through smart contracts. If the conditions are met, the claim is approved and processed without manual intervention.",
  },
  {
    question: "Why should I trust a blockchain-based system?",
    answer:
      "Blockchain provides an immutable ledger, meaning once data is recorded, it cannot be altered. This ensures your policy and claim data are secure, transparent, and verifiable.",
  },
  {
    question: "Do I need cryptocurrency to use the system?",
    answer:
      "Yes, users typically interact with the system using a blockchain wallet like MetaMask and will need testnet tokens for interacting during testing or real crypto in production.",
  },
  {
    question: "Can I access the platform on mobile devices?",
    answer:
      "Yes, the frontend is responsive. However, to interact with smart contracts, you'll need a Web3-compatible mobile browser or MetaMask Mobile.",
  },

    {
    question: "How do I download, set up, and connect MetaMask?",
    answer:
      "Go to the meta mask extension download page, download the meta mask extension, set up a profile for yourself and give your meta account credentials.",

      
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-indigo-600 mb-2">
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
