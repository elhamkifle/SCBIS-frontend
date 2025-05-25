import ForgotPassword from '@/components/Sessions/ForgotPassword'
import React from 'react'
import { Footer } from '@/components/staticComponents/footer'
import Header from '@/components/staticComponents/header'
import Sidebar from '@/components/staticComponents/sidebar'

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

                    <ForgotPassword/>
    
                </div>
            </div>
  )
}

export default page
