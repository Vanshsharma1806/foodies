import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/cart");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold text-red-600">Payment Cancelled ❌</h1>
      <p className="mt-2">Redirecting back to cart...</p>
    </div>
  );
};

export default PaymentCancel;
