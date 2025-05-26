import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import LandingPage from "@/components/staticComponents/landingPage";

export default function HomePage() {
    return (
        <div className="flex min-h-screen">
           

            {/* Main Page Content */}
            <div className="flex-1 flex flex-col">
                {/* Fixed Header */}
                <div className="sticky top-0 w-full z-50">
                    <Header />
                </div>

                <LandingPage/>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
