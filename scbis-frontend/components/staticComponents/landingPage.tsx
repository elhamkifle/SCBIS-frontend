'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Hero() {
    const router = useRouter();
    const handleNext = () => {
        router.push('/');
    }

    const covers = [
        {
            title: 'Compulsory Third-Party Cover',
            description: 'Legal requirement for all vehicles',
            info: `Protects you from legal responsibility for injury, death, or property damage caused to others.`,
            benefits: [
                "Covers your car's damages, fire, and theft.",
                "Ideal if you're seeking coverage for your vehicle without the full extent of a comprehensive policy.",
            ],
            button: 'LEARN MORE',
        },
        {
            title: 'Own Damage Cover',
            description: 'Protects your vehicle from specific risks',
            info: `Covers your own vehicle in case of damage from accidents, fire, or theft.`,
            benefits: [
                "Covers your car's damages, fire, and theft.",
                "Ideal if you're seeking coverage for your vehicle without the full extent of a comprehensive policy.",
            ],
            button: 'LEARN MORE',
        },
        {
            title: 'Comprehensive Cover',
            description: 'Full protection for you and others',
            info: `Complete protection for your vehicle and third-party liabilities, including theft and natural disasters.`,
            benefits: [
                'Covers your vehicle, theft, fire, and third-party liabilities.',
                'Ideal for maximum protection against accidents and losses.',
            ],
            button: 'LEARN MORE',
        },
    ];



    return (
        <>
            {/* HERO */}
            {/* <section className="w-full h-full flex flex-col md:flex-row bg-[#1F4878]">
                <div className="w-full md:w-1/3">
                    <p className="text-white text-xl font-syne p-5 md:text-3xl md:p-10 text-center">SCBIS</p>
                    <img className="hidden lg:block" src="/hand.svg" alt="Hand Image" />
                </div>

                <div className="w-full md:w-2/3 flex flex-col justify-around p-6 text-white">
                    <h1 className="text-4xl font-bold mb-6 md:mb-0">
                        The smart vehicle insurance system for all your needs.
                    </h1>
                    <ul className='text-xl ml-12 mb-6 md:mb-0'>
                        <li className='mb-2 md:mb-0'> Blockchain backed. </li>
                        <li className='mb-2 md:mb-0'> Easy and quick to use.</li>
                        <li className='mb-2 md:mb-0'> Complete coverage for any of your motor insurance needs.</li>
                    </ul>

                    <div className="flex flex-col justify-start sm:flex-row gap-4 md:gap-8">
                        <button
                            onClick={handleStart}
                            className="bg-[#7AC943] text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                        >
                            Purchase a Policy
                        </button>

                        <button
                            onClick={handleStart}
                            className="bg-[#7AC943] text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                        >
                            Start a New Claim
                        </button>
                    </div>
                </div>
            </section> */}

            <section className="flex items-center justify-center bg-gradient-to-r from-[#e6edf2] to-[#1F4878] px-4">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* Left image section */}
                    <div className="relative w-full h-[20px] lg:h-[500px] md:h-[600px]">
                        <Image
                            src="/hand.svg"
                            alt="SCBIS logo"
                            layout="fill"
                            objectFit="contain"
                            className="hidden md:block"
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mb-10 md:mb-0 mx-auto md:mx-0">
                        <p className="text-sm tracking-widest text-gray-500 uppercase mb-4">SCBIS </p>
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                            The smart vehicle insurance system for all your needs.
                        </h1>

                        <p className='mb-8'> Blockchain backed. Secure. Easy. </p>
                        <div className="flex flex-col justify-start sm:flex-row gap-4 md:gap-8">
                            <button
                                onClick={ () => router.push("/policy-purchase/personal-information/personalDetails")}
                                className="bg-[#7AC943] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1F4878] transition"
                            >
                                Purchase a Policy
                            </button>

                            <button
                                onClick={() => router.push("/claim-submission/vehicle-selection")}
                                className="bg-[#7AC943] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1F4878] transition"
                            >
                                Start a New Claim
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR INSURANCE SERVICES */}
            <section className="w-full bg-white py-16 px-6">
                <div className="flex items-center mb-10">
                    <div className="w-4 h-10 bg-[#1F4878] mr-6" />
                    <h1 className="text-3xl font-bold text-[#1F4878]">
                        Our Insurance Services
                    </h1>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {covers.map((cover, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md border border-gray-100 w-full sm:w-[340px] p-6 flex flex-col justify-between"
                        >
                            <div className="h-1.5 w-full bg-[#30B5B0] rounded-t-xl mb-4 -mt-6" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase mb-2">
                                    Related Policy
                                </p>
                                <p className="text-xl font-bold text-gray-800 mb-3">
                                    {cover.title}
                                </p>
                                <p className="text-black text-md mb-6">{cover.info}</p>

                                <ul className="text-left space-y-2 mb-6">
                                    {cover.benefits.map((benefit, i) => (
                                        <li key={i} className="sm:flex items-start space-x-2 block">
                                            ✅<span className='ml-3 text-black'>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className="mt-auto inline-block bg-[#7AC943] text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-[#6ab035] transition">
                                {cover.button} →
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why us SECTION */}
            <section className="w-full bg-white py-16 px-6">
                <div className="flex items-center mb-8">
                    <div className="w-2 h-10 bg-[#1F4878] mr-3" />
                    <h1 className="text-3xl font-bold text-[#1F4878]">
                        Why us?
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* WHY US ITEM */}
                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-[#1F4878] to-[#30B5B0] flex items-center justify-center">
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[#1F4878]">Made with Care</p>
                            <p className="text-gray-700 mt-2">
                                Our system is designed to minimize headaches and unnecessary trips. Do almost everything right from your home.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-[#1F4878] to-[#30B5B0] flex items-center justify-center">
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[#1F4878]">Easy and Secure </p>
                            <p className="text-gray-700 mt-2">
                                We&apos;ve built a secure and robust system that is easy to use by anyone. Everything is one click away.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-[#1F4878] to-[#30B5B0] flex items-center justify-center">
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[#1F4878]">Diverse Motor Insurance Products</p>
                            <p className="text-gray-700 mt-2">
                                We provide a wide portfolio of coverage types tailored to our clients&apos; motor insurance needs.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-[#1F4878] to-[#30B5B0] flex items-center justify-center">
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[#1F4878]">Digitisation & Automation</p>
                            <p className="text-gray-700 mt-2">
                                From claims to communication, our smart digital systems save time and enhance reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#1F4878] py-12 px-6 text-white">
                <div className="max-w-4xl mx-auto text-center ">
                    <p className=" text-white text-3xl md:text-4xl font-bold mb-4">
                        Ready to Get Insured?
                    </p>
                    <p className="text-lg mb-6 text-white">
                        Sign up or log in to select and purchase your policies today.
                    </p>

                    <button type="submit" onClick={handleNext} className="bg-green-500 text-white p-10 py-2 rounded font-semibold hover:bg-green-400">Sign Up </button>

                </div>
            </section>

        </>
    );
}
