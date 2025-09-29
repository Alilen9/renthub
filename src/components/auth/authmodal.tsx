"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";





import SignupForm from "./signup";
import ForgotPasswordForm from "./forgotpassword";
import LoginForm from "./login";
import SuccessPopup from "./successpopup";

type View = "login" | "signup" | "forgot" | "success";

export default function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<View>("login");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            {view === "login" && (
              <LoginForm
                onForgot={() => setView("forgot")}
                onSignup={() => setView("signup")}
              />
            )}
            {view === "signup" && (
              <SignupForm
                onLogin={() => setView("login")}
                onSuccess={() => setView("success")}
              />
            )}
            {view === "forgot" && <ForgotPasswordForm onLogin={() => setView("login")} />}
            {view === "success" && (
              <SuccessPopup onDone={() => setView("login")} />
            )}

            {/* Close Btn */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
