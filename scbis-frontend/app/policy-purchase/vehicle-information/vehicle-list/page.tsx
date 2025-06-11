import Sidebar from "@/components/staticComponents/sidebar";
import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import VehicleList from "@/components/PolicyPurchase/VehicleInformation/VehicleList";

export default function VehicleListPage() {
    return (
        <div className="flex min-h-screen ">
            {/* Sidebar for Large Screens */}
            <div className="hidden lg:flex sticky top-0 bottom-0 h-screen overflow-y-auto">
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
                        <VehicleList />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Added: {new Date(vehicle.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          !error && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No vehicles found</h4>
              <p className="text-gray-500 mb-6">You haven't added any vehicles yet.</p>
              <button
                onClick={handleCreateNewVehicle}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Vehicle
              </button>
            </div>
          )
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between w-full max-w-6xl mt-8">
        <button
          onClick={() => router.back()}
          className="border border-black px-6 py-2 rounded-lg hover:bg-gray-50 text-black"
        >
          Back
        </button>
        <div className="text-sm text-gray-500">
          Select a vehicle to continue
        </div>
      </div>
    </div>
  );
} 