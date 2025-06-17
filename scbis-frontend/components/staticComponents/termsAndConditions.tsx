// app/terms/page.tsx

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">
          Terms and Conditions
        </h1>

        <p className="mb-4 text-gray-600 text-sm text-center">
          Last updated: June 17, 2025
        </p>

        <section className="space-y-8 text-lg leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to our Smart Contract-Based Insurance System. By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              2. Eligibility
            </h2>
            <p>
              You must be at least 18 years old and have the legal capacity to enter into agreements to use this platform. You are responsible for ensuring that your use complies with applicable laws in your jurisdiction.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              3. Use of the Platform
            </h2>
            <p>
              You agree to use the platform only for lawful purposes. Any misuse, including attempting to reverse-engineer smart contracts or exploit vulnerabilities, will result in termination of access and possible legal action.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              4. Smart Contract Risk Disclaimer
            </h2>
            <p>
              Blockchain-based systems carry inherent risks, including potential bugs in smart contracts. While we take security seriously, we do not guarantee the system is free from errors or vulnerabilities. Use the system at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              We are not liable for any losses or damages resulting from the use of the platform, including but not limited to loss of funds, loss of data, or service interruptions caused by smart contract behavior or third-party issues.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              6. User Data and Wallets
            </h2>
            <p>
              We do not store your private keys or wallet information. You are solely responsible for securing your crypto wallet and recovery phrases. Interactions with the smart contract are recorded on the blockchain publicly and immutably.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              7. Changes to Terms
            </h2>
            <p>
              We may update these Terms and Conditions from time to time. Any changes will be reflected on this page, and continued use of the platform constitutes your acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
              8. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about these Terms, please contact us at <a href="mailto:contact@blockinsure.com" className="text-indigo-500 underline">contact@blockinsure.com</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
