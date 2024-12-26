import React from "react";

import dotenv from "dotenv";
dotenv.config();

// Google OAuth2 Configuration
const GOOGLE_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const GOOGLE_SCOPE: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_SCOPE;
const GOOGLE_REDIRECT_URI: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
const GOOGLE_AUTHORIZATION_GRANT_TYPE: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZATION_GRANT_TYPE;

// Google OAuth2 Endpoints
const GOOGLE_AUTHORIZATION_URI: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZATION_URI;

const GoogleLogin = () => {
  // Function to Handle Google Login
  const handleGoogleLogin = (): void => {
    if (
      !GOOGLE_CLIENT_ID ||
      !GOOGLE_REDIRECT_URI ||
      !GOOGLE_SCOPE ||
      !GOOGLE_AUTHORIZATION_URI
    ) {
      console.log(GOOGLE_CLIENT_ID);
      console.log(GOOGLE_REDIRECT_URI);
      console.log(GOOGLE_SCOPE);
      console.log(GOOGLE_AUTHORIZATION_URI);
      console.error("Missing Google OAuth configuration");
      return;
    }

    const queryParams = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID || "",
      redirect_uri: GOOGLE_REDIRECT_URI || "",
      response_type: "code",
      scope: GOOGLE_SCOPE?.replace(/,/g, " ") || "", // Replace commas with spaces
      access_type: "offline",
      prompt: "consent",
    });

    console.log(`${GOOGLE_AUTHORIZATION_URI}?${queryParams.toString()}`);

    // Redirect the user to the authorization URL
    if (GOOGLE_AUTHORIZATION_URI) {
      window.location.href = `${GOOGLE_AUTHORIZATION_URI}?${queryParams.toString()}`;
    } else {
      console.error("GOOGLE_AUTHORIZATION_URI is not defined");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-900">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login with Google
        </h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg transition duration-300"
        >
          <img
            src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png"
            alt="Sign in with Google"
            className="h-6"
          />
          <span className="ml-4">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default GoogleLogin;
