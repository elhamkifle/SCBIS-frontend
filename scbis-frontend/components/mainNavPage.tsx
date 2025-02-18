export default function MainNavPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 p-6">
        {/* Card 1 */}
        <a href="#" className="block max-w-sm p-6 bg-gradient-to-b from-blue-200 to-blue-500 border rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center cursor-pointer">
        <img src="https://via.placeholder.com/150" alt="Card 1" className="w-16 h-16 mx-auto" />
          <h1 className="text-xl font-bold mt-4 text-black">Policy Purchase</h1>
          <p className="text-black">Browse and purchase motor insurance policies that fit your needs.</p>
        </a>

        {/* Card 2 */}
        <a href="#" className="block max-w-sm p-6 bg-gradient-to-b from-blue-200 to-blue-500 border rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
          <img src="https://via.placeholder.com/150" alt="Card 2" className="w-16 h-16 mx-auto" />
          <h1 className="text-xl font-bold mt-4 text-black">Submit a Claim</h1>
          <p className="text-black">Have an incident? Submit your claim and upload supporting documents easily.</p>
        </a>

        {/* Card 3 */}
        <a href="#" className="block max-w-sm p-6 bg-gradient-to-b from-blue-200 to-blue-500 border rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
          <img src="https://via.placeholder.com/150" alt="Card 3" className="w-16 h-16 mx-auto" />
          <h1 className="text-xl font-bold mt-4 text-black">Policy Details & Status</h1>
          <p className="text-black">View your active policies, renewal dates, and policy terms.</p>
        </a>

        {/* Card 4 */}
        <a href="#" className="block max-w-sm p-6 bg-gradient-to-b from-blue-200 to-blue-500 border rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
          <img src="https://via.placeholder.com/150" alt="Card 4" className="w-16 h-16 mx-auto" />
          <h1 className="text-xl font-bold mt-4 text-black">Track Claim Status</h1>
          <p className="text-black">Check the status of your submitted claims.</p>
        </a>
      </div>
    </div>


  );
}
