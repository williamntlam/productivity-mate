import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    avatar: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Access token not found. Please log in again.");
        }

        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/users/info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }

        const data = await response.json();

        setUserProfile({
          name: data.name || "Unknown User",
          email: data.email || "No email provided",
          avatar: data.picture || "/avatar-placeholder.png",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center h-screen">
        {/* Profile Card */}
        <section className="flex flex-col bg-gray-800 p-16 rounded-lg w-3/4 max-w-4xl items-center text-center">
          {/* Profile Avatar */}
          <img
            src={userProfile.avatar}
            alt={`${userProfile.name}'s avatar`}
            className="w-64 h-64 rounded-full mb-8 border-4 border-gray-600 object-cover"
          />

          {/* Profile Info */}
          <h1 className="text-4xl font-bold mb-4">{userProfile.name}</h1>
          <p className="text-xl text-gray-400 mb-4">{userProfile.email}</p>
          <p className="text-lg text-gray-400">
            {userProfile.firstName} {userProfile.lastName}
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
