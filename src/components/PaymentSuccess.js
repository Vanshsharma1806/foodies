import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import useAuthHeaders from "../utils/useAuthHeaders";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const {setCurrentOrder} = useOrder(); 
  const partialOrder = JSON.parse(localStorage.getItem("pendingOrder"));
  const authHeaders = useAuthHeaders();
  const{clearCart} = useCart();

  useEffect(()=>{
    const verifyAndSaveOrder = async()=>{
      try {
        
        const res = await fetch(`http://localhost:8080/api/payment/confirm?sessionId=${sessionId}`,{
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify(partialOrder)
          
          }
        );
        if (!res.ok) throw new Error("Failed to confirm payment");
        const savedOrder = await res.json();
        setCurrentOrder(savedOrder);
        localStorage.setItem("currentOrderId", savedOrder.id);
        localStorage.setItem("currentOrder",JSON.stringify(savedOrder));

        clearCart();

        setTimeout(()=>navigate(`/order/${savedOrder.id}`), 5000);

      } catch (error) {
        console.error(err);
        navigate("/payment-failed");
      }
    }


    if(sessionId) verifyAndSaveOrder();

  }, [sessionId, setCurrentOrder, navigate]);



  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-semibold">Payment processing…</h1>
      <p>You will be redirected to your order summary shortly.</p>
    </div>
  );
};

export default PaymentSuccess;
