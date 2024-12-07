import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic ID from the URL

  // Mock Profile Data (Replace with API or database call)
  const userProfile = {
    id: id || "123", // Default ID for mock data
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "A passionate developer who loves building amazing web applications.",
    joined: "2022-05-15",
    avatar: "/avatar-placeholder.png", // Add a placeholder image to your public folder
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center h-screen">
        {/* Profile Card */}
        <section className="flex flex-col bg-gray-800 p-6 rounded-md w-full items-center text-center">
          {/* Profile Avatar */}
          <img
            src={userProfile.avatar}
            alt={`${userProfile.name}'s avatar`}
            className="w-32 h-32 rounded-full mb-4 border-4 border-gray-600"
          />

          {/* Profile Info */}
          <h1 className="text-2xl font-bold mb-2">{userProfile.name}</h1>
          <p className="text-gray-400 mb-4">{userProfile.email}</p>
          <p className="text-sm text-gray-400 mb-6">{userProfile.bio}</p>
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-300">Joined:</span>{" "}
            {new Date(userProfile.joined).toLocaleDateString()}
          </p>
        </section>

        {/* Action Buttons */}
        <section className="flex gap-4 mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium">
            Edit Profile
          </button>
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-medium">
            Delete Account
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} ProductivityMate. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
