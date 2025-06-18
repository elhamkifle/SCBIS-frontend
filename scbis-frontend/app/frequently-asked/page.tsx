import React from 'react'
import Header from '@/components/staticComponents/header'
import { Footer } from '@/components/staticComponents/footer'
import FAQPage from '@/components/staticComponents/faqs'

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

            <FAQPage />

            <Footer />

        </div>
    </div>
  )
}

export default page
