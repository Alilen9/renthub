"use client";

import { useState, useRef, JSX } from "react";
import { toast } from "react-hot-toast";
import { registerUser } from "@/services/authService";
import { RegisterFormData, Role } from "@/utils/auth";
import { FiCamera, FiUpload, FiCheckCircle, FiCreditCard, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";


type KycStep = 1 | 2 | 3;

export default function SignupForm({
  onLogin,
  onSuccess,
}: {
  onLogin: () => void;
  onSuccess: () => void;
}) {
  const [role, setRole] = useState<Role>("tenant");
  const [kycStep, setKycStep] = useState<KycStep | 0>(0);
  const [underReview, setUnderReview] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    username: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Start camera
  const startCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error("Camera access denied or unavailable.");
      setUseCamera(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) setFile(new File([blob], `kyc-step-${kycStep}.png`, { type: "image/png" }));
    });

    const stream = videoRef.current.srcObject as MediaStream | null;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setUseCamera(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleNextStep = async () => {
    if (!file) {
      toast.error("Please upload or capture your document.");
      return;
    }
    
    if (kycStep < 3) {
      setFile(null); // clear for next step
      setKycStep((prev) => (prev + 1) as KycStep);
    } else {
      setIsLoading(true);
      try {
        await registerUser({ ...formData, username: formData.email }, role);
        setUnderReview(true);
      } catch (err: unknown) {
        toast.error((err as Error).message || "Registration failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === "tenant") {
        await registerUser({ ...formData, username: formData.email }, role);
        toast.success("Account created! Please log in.");
        onSuccess();
      } else {
        setKycStep(1); // Start KYC for landlord/service provider
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Under Review ---
  if (underReview) {
    return (
      <div className="space-y-6 text-center p-6 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
        <FiCheckCircle className="mx-auto text-green-500" size={60} />
        <h2 className="text-xl font-semibold">Verification Under Review</h2>
        <p className="text-gray-600 text-sm">
          Your documents and selfie have been submitted. Our team will review them.
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

  // --- KYC Wizard ---
  if (kycStep > 0) {
    const stepTitles: Record<KycStep, string> = {
      1: "ID Front",
      2: "ID Back",
      3: "Selfie",
    };

    const stepIcons: Record<KycStep, JSX.Element> = {
      1: <FiCreditCard size={24} />,
      2: <FiCreditCard size={24} />,
      3: <FiUser size={24} />,
    };

    return (
      <div className="space-y-6 p-6 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
        {/* Step Indicators */}
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition ${
                  s <= kycStep ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              <span className="text-xs text-center">{stepTitles[s as KycStep]}</span>
            </div>
          ))}
        </div>

        <motion.div
          key={kycStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col gap-4"
        >
          <div className="text-center flex flex-col items-center gap-2 mb-4">
            {stepIcons[kycStep as KycStep]}
            <p className="text-sm text-gray-600">
              {kycStep === 3
                ? "Take a clear selfie in a well-lit area."
                : "Upload a clear image for verification."}
            </p>
          </div>

          {/* Upload Section */}
          {!useCamera && (
            <div className="flex flex-col gap-3">
              <label className="flex flex-col items-center justify-center border border-dashed border-gray-400 p-6 rounded-lg cursor-pointer hover:bg-gray-50 w-full text-black">
                <FiUpload size={24} className="mb-2" />
                <span className="text-sm">Click or drag file to upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
              >
                <FiCamera /> Use Camera
              </button>
            </div>
          )}

          {/* Camera Section */}
          {useCamera && (
            <div className="flex flex-col gap-3">
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

          <button
            type="button"
            onClick={handleNextStep}
            className={`w-full py-2 rounded-lg transition ${
              file
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!file}
          >
            {kycStep < 3 ? "Continue" : "Finish Verification"}
          </button>
        </motion.div>
      </div>
    );
  }

  // --- Signup Form ---
  return (
    <form
      onSubmit={handleSignup}
      className="space-y-4 p-6 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-black">Create Account</h2>
      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleInputChange}
        required
        className="w-full px-4 py-2 border border-black text-black rounded-lg"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
        className="w-full px-4 py-2 border border-black text-black rounded-lg"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-black text-black rounded-lg"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
        minLength={6}
        className="w-full px-4 py-2 border border-black text-black rounded-lg"
      />

      {/* Role */}
      <div className="flex gap-4 text-black">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="tenant"
            checked={role === "tenant"}
            onChange={(e) => setRole(e.target.value as Role)}
          />
          Tenant
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="landlord"
            checked={role === "landlord"}
            onChange={(e) => setRole(e.target.value as Role)}
          />
          Landlord
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="service_provider"
            checked={role === "service_provider"}
            onChange={(e) => setRole(e.target.value as Role)}
          />
          Service Provider
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300"
      >
        {isLoading ? 'Creating...' : ('Create Account')}
      </button>

      <p className="text-sm text-center text-black">
        Already have an account?{" "}
        <button type="button" onClick={onLogin} className="text-black hover:underline">
          Login
        </button>
      </p>
    </form>
  );
}
