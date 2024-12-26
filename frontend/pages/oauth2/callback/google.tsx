import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
dotenv.config();

const GoogleCallback = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { code } = router.query;

      if (!code) {
        setErrorMessage("Authorization code is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/oauth2/callback/google?code=${code}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to exchange authorization code.");
        }

        const data = await response.json();

        console.log("Access Token:", data.accessToken);
        console.log("Refresh Token:", data.refreshToken);
        console.log("User Email:", data.email);
        console.log("User Name:", data.name);

        // Handle tokens, save them, or redirect
        router.push("/tasks");
      } catch (error) {
        console.error("Error exchanging code:", error);
        setErrorMessage(
          "An error occurred during authentication. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      handleOAuthCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {isLoading ? (
        <div className="text-lg font-semibold text-gray-700">
          Processing Google OAuth callback...
        </div>
      ) : errorMessage ? (
        <div className="text-white text-center">
          <p className="text-3xl font-semibold">Error</p>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <div className="text-3xl font-semibold text-gray-700">
          Successfully authenticated! Redirecting...
        </div>
      )}
    </div>
  );
};

export default GoogleCallback;
