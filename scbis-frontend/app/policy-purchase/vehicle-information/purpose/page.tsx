import Sidebar from "@/components/staticComponents/sidebar";
import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import ChoosePurposeForm from "@/components/PolicyPurchase/VehicleDetails/purpose";
import { AuthWrapper } from "@/utils/withAuth";

export default function HomePage() {
    return (
        <AuthWrapper requireAuth={true} requireVerification={true}>
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

                    {/* Sidebar as a Card (Only for Small & Medium Screens) */}
                    <div className="lg:hidden flex justify-center mt-6">
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 mt-6">
                        <div className="max-w-6xl mx-auto px-4">
                            <ChoosePurposeForm />
                        </div>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </AuthWrapper>
    );
}
