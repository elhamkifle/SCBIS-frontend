import Sidebar from "@/components/staticComponents/sidebar";
import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import PolicyDetails from "@/components/policyDetails";

export default function HomePage() {
    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="sticky top-0 w-full z-50">
                    <Header />
                </div>
                <div className="lg:hidden flex justify-center mt-6">
                    <Sidebar />
                </div>
                <main className="flex-1 mt-6">
                    <div className="max-w-6xl mx-auto px-4">
                        <PolicyDetails />
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
