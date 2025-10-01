"use client";

import { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  onSuccess,
}: PaymentModalProps) {
  const [method, setMethod] = useState<"mpesa" | "bank" | null>(null);
  const [phone, setPhone] = useState("");
  const [waitingForPhone, setWaitingForPhone] = useState(false);

  const handlePay = () => {
    if (!method) return;

    if (method === "mpesa") {
      if (!phone || phone.length < 10) {
        alert("Enter a valid M-Pesa number");
        return;
      }

      // Assume STK Push sent to phone
      setWaitingForPhone(true);

      // Simulate success after delay (e.g. Safaricom callback)
      setTimeout(() => {
        alert(`Payment of Ksh ${amount} via M-Pesa successful ✅\nPhone: ${phone}`);
        onSuccess();
        setWaitingForPhone(false);
        onClose();
      }, 5000); // wait 5s
    } else {
      alert(`Bank transfer of Ksh ${amount} completed! ✅`);
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Payment">
      <div className="space-y-4 text-black">
        <p>
          Amount: <span className="font-semibold">Ksh {amount}</span>
        </p>

        {!waitingForPhone ? (
          <>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="mpesa"
                  checked={method === "mpesa"}
                  onChange={() => setMethod("mpesa")}
                />
                M-Pesa
              </label>
              {method === "mpesa" && (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Enter M-Pesa Number"
                />
              )}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={method === "bank"}
                  onChange={() => setMethod("bank")}
                />
                Bank Transfer
              </label>
            </div>

            <Button
              onClick={handlePay}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              Pay Now
            </Button>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm">
              A payment prompt has been sent to{" "}
              <span className="font-semibold">{phone}</span>.  
              Please check your phone and enter your M-Pesa PIN to complete the transaction.
            </p>
            <p className="text-gray-500 text-xs">Waiting for confirmation...</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
