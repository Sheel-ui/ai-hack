import Profile from "./_components/Profile";
import Recommendations from "./_components/Recommendations";

export default function Dashboard() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <div className="w-5/7 flex flex-col items-center justify-center">
      <Recommendations />
      </div>

      <div className="w-2/7 flex justify-center">
        <Profile />
      </div>
    </div>
  );
}
