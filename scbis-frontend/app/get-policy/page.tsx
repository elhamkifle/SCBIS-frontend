import MyPoliciesPage from '@/components/blockchain/getMyPolicy'
import React from 'react'
import Header from '@/components/staticComponents/header'
import Sidebar from '@/components/staticComponents/sidebar'

const GetPolicyPage = () => {
  return (
    <div className="flex min-h-screen">
            {/* Sidebar for Large Screens */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Main Page Content */}
            <div className="flex-1 flex flex-col">
                {/* Fixed Header */}
                <div className="sticky top-0 w-full z-50">
                    <Header />
                </div>

                <MyPoliciesPage/>

            </div>
        </div>
  )
}

export default GetPolicyPage
