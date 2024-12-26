import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
        const response = await fetch("/api/oauth2/google/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Access Token:", data.access_token);
          // Redirect the user or handle the access token
          router.push("/tasks");
        } else {
          throw new Error(
            data.error || "Failed to exchange authorization code."
          );
        }
      } catch (error: any) {
        console.error("Error exchanging code:", error.message);
        setErrorMessage(
          "An error occurred during authentication. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [router.query]);

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
