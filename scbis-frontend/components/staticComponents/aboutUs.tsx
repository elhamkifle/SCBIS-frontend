import Image from 'next/image';

export default function AboutPage() {

    const members = 
    [
        {
            name: "Fanual Asfaw",
            role: "Full stack and Blockchain Developer",
            image: "/fanual.jpg",
            email:"asfawfanual2003@gmail.com"
        },

        {
            name: "Elham Mulugeta",
            role: "Frontend Developer",
            image: "/elham3.jpg",
            email:"elhamkifle@gmail.com"
        },

        {
            name: "Yanet Yohannes",
            role: "Frontend Developer",
            image: "/yanet.jpg",
            email:"yanetyohabeyene@gmail.com"
        },

        {
            name: "Bereket Legesse",
            role: "Full Stack Developer",
            image: "/bereket.jpg",
            email:"bereketlegesse@gmail.com"
        },

        {
            name: "Haile Adugna",
            role: "Full Stack Developer (Backend heavy)",
            image: "/haile.jpg",
            email:"haileadugna@gmail.com"
        }
    
    ]

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="mt-4 text-lg md:text-xl">
            Empowering insurance with the transparency and trust of blockchain.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">Who We Are</h2>
          <p className="text-lg leading-relaxed">
            We are a team of passionate developers and researchers committed to redefining the insurance industry using blockchain technology. Our final year project aims to create a decentralized, transparent, and fraud-resistant insurance system that empowers users to manage policies and claims securely.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-700">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To build a reliable and efficient insurance platform powered by smart contracts. We aim to eliminate traditional bottlenecks, enhance user trust, and ensure that claims are processed automatically based on verifiable conditions.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-indigo-700">Why Blockchain?</h2>
          <div className="text-lg leading-relaxed">
            Traditional insurance systems often suffer from inefficiencies, delayed processes, and lack of transparency. By using blockchain, we ensure:
            <ul className="list-disc ml-6 mt-4 text-lg">
              <li>Immutable and transparent records of policies and claims</li>
              <li>Automatic execution of conditions using smart contracts</li>
              <li>Decentralized trust without intermediaries</li>
            </ul>
          </div>
        </div>
      </section>

       <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">Meet the Team</h2>
          <p className="text-lg text-gray-700 mb-10">We are a dedicated group of final year students bringing this vision to life.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 hover:scale-105 transition-transform"
              >
                <Image
                    src={member.image}
                    className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4 object-cover" 
                    alt={member.name}
                    width={96}
                    height={96}
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <p className='bg-indigo-700 px-2 py-1 my-2 rounded-md text-white'>{member.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
