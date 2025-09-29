"use client";

import { useState, useRef } from "react";

export default function SignupForm({
  onLogin,
  onSuccess,
}: {
  onLogin: () => void;
  onSuccess: () => void;
}) {
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [kycStep, setKycStep] = useState<0 | 1 | 2 | 3>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [underReview, setUnderReview] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "landlord") {
      setKycStep(1); // Start KYC flow
    } else {
      onSuccess(); // Tenants go straight to success
    }
  };

  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or not available.");
      setUseCamera(false);
    }
  };

  // Capture photo & stop camera
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      setPreview(canvas.toDataURL("image/png"));
    }

    // Stop camera after capture
    const stream = videoRef.current.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    videoRef.current.srcObject = null;
    setUseCamera(false);
  };

  // Continue to next KYC step
  const handleNextStep = () => {
    setPreview(null);
    setUseCamera(false);

    if (kycStep < 3) {
      setKycStep((prev) => (prev + 1) as typeof kycStep);
    } else {
      setUnderReview(true); // Final step → under review
    }
  };

  // --- Under Review ---
  if (underReview) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold text-black">
          Verification Under Review
        </h2>
        <p className="text-sm text-gray-600">
          Your documents and selfie have been submitted. Our team is reviewing
          them. Once approved, you’ll be able to log in as a landlord.
        </p>

        <button
          onClick={onLogin}
          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // --- KYC Steps ---
  if (kycStep > 0) {
    const stepTitles: Record<1 | 2 | 3, string> = {
      1: "Step 1: Upload or Capture ID (Front)",
      2: "Step 2: Upload or Capture ID (Back)",
      3: "Step 3: Capture a Selfie",
    };

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-black">
          {stepTitles[kycStep as 1 | 2 | 3]}
        </h2>
        <p className="text-sm text-gray-600">
          {kycStep === 3
            ? "Take a clear selfie in a well-lit area."
            : "Provide a clear image for verification."}
        </p>

        {/* Upload Option */}
        {!useCamera && (
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              capture={kycStep === 3 ? "user" : "environment"}
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-black text-black rounded-lg"
            />
            <button
              type="button"
              onClick={startCamera}
              className="w-full py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
            >
              Use Camera Instead
            </button>
          </div>
        )}

        {/* Camera View */}
        {useCamera && (
          <div className="space-y-3">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-48 object-cover border border-black rounded-lg"
            />
            <button
              type="button"
              onClick={capturePhoto}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Capture Photo
            </button>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="space-y-3">
            <p className="text-sm text-black">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover border border-black rounded-lg"
            />
            {/* Allow retake */}
            <button
              type="button"
              onClick={startCamera}
              className="w-full py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
            >
              Retake Photo
            </button>
          </div>
        )}

        {/* Continue */}
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!preview}
          className={`w-full py-2 rounded-lg transition ${
            preview
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {kycStep < 3 ? "Continue" : "Finish Verification"}
        </button>
      </div>
    );
  }

  // --- Normal Signup ---
  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <h2 className="text-xl font-semibold text-black">Create Account</h2>

      <input
        type="text"
        placeholder="First Name"
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg"
      />
      <input
        type="text"
        placeholder="Last Name"
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full px-4 py-2 border border-black text-black rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border border-black text-black placeholder-black rounded-lg"
      />

      {/* Role Selection */}
      <div className="flex gap-4 text-black">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="tenant"
            checked={role === "tenant"}
            onChange={() => setRole("tenant")}
          />
          Tenant
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="landlord"
            checked={role === "landlord"}
            onChange={() => setRole("landlord")}
          />
          Landlord
        </label>
      </div>

      <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
        Create Account
      </button>

      <p className="text-sm text-center text-black">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onLogin}
          className="text-black hover:underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}
