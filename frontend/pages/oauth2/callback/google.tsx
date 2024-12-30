import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const GoogleOAuthCallback = () => {
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
        // Make the POST request to your backend
        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/oauth2/callback/google`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }), // Send code in the request body
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            errorResponse.error || "Failed to exchange authorization code."
          );
        }

        const data = await response.json();

        localStorage.setItem("accessToken", data.accessToken);

        // Redirect the user or save tokens as needed
        router.push("/tasks");
      } catch (error: any) {
        console.error("Error exchanging code:", error.message);
        setErrorMessage(
          "An error occurred during authentication. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Ensure the router is ready and the query is available
    if (router.isReady) {
      handleOAuthCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {isLoading ? (
        <div className="text-lg font-semibold text-gray-700">
          Processing Google OAuth callback...
        </div>
      ) : errorMessage ? (
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error</p>
          <p>{errorMessage}</p>
        </div>
      ) : null}
    </div>
  );
};

export default GoogleOAuthCallback;
