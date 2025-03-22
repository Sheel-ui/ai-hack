import Profile from "./_components/Profile";

export default function Dashboard() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      {/* Left Section (60%) */}
      <div className="w-5/7 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-gray-600 mt-2">Welcome to your analytics!</p>
      </div>

      {/* Right Section (40%) */}
      <div className="w-2/7 flex justify-center">
        <Profile />
      </div>
    </div>
  );
}
