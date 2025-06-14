"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OrderConfirmationPage = () => {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "ORD000000";
  const deliveryDateStart = params.get("startDate") || "Jun 20";
  const deliveryDateEnd = params.get("endDate") || "Jun 23";

  useEffect(() => {
    confetti({
      particleCount: 300,
      spread: 200,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-card p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-green-500 mb-4"
        >
          <CheckCircle2 className="w-16 h-16 mx-auto" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Thank you for your purchase. A confirmation email has been sent.
        </p>

        <div className="bg-muted p-4 rounded-xl text-left text-sm mb-6 space-y-1">
          <p>
            <span className="font-semibold">Order ID:</span> #{orderId}
          </p>
          <p>
            <span className="font-semibold">Estimated Delivery:</span>{" "}
            {deliveryDateStart} - {deliveryDateEnd}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/orders">
            <Button variant="outline" className="w-full">
              Track Order
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default OrderConfirmationPage;
