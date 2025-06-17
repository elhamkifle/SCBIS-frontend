import React from 'react'
import Header from '@/components/staticComponents/header'
import AboutPage from '@/components/staticComponents/aboutUs'
import { Footer } from '@/components/staticComponents/footer'

const page = () => {
  return (
    <div className="flex min-h-screen">
        {/* Sidebar for Large Screens */}
        {/* <div className="hidden lg:flex">
            <Sidebar />
        </div> */}

        {/* Main Page Content */}
        <div className="flex-1 flex flex-col">
            {/* Fixed Header */}
            <div className="sticky top-0 w-full z-50">
                <Header />
            </div>

            <AboutPage />

            <Footer />

        </div>
    </div>
  )
}

export default page
