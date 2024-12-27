import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    // Fetch user profile from localStorage
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedAvatar = localStorage.getItem("avatar");
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");

    setUserProfile({
      name: storedName || "Unknown User",
      email: storedEmail || "No email provided",
      avatar: storedAvatar || "/avatar-placeholder.png",
      firstName: storedFirstName || "",
      lastName: storedLastName || "",
    });
  }, []);

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
      <footer className="bg-gray-800 text-center py-4">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} ProductivityMate. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
