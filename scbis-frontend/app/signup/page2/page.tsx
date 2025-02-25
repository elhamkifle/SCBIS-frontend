import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import Signup from "@/components/Sessions/Signup2";


export default function HomePage() {
    return (
        <div className="flex min-h-screen">
           

            {/* Main Page Content */}
            <div className="flex-1 flex flex-col">
                {/* Fixed Header */}
                <div className="sticky top-0 w-full z-50">
                    <Header />
                </div>

                <Signup/>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
