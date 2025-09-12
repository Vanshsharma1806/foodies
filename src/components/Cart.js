
import { useCart } from "../context/CartContext";
import { ITEM_LOGO } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { loadStripe } from "@stripe/stripe-js";
import useAuthHeaders from "../utils/useAuthHeaders";
const Cart = ()=>{
  
  const {cartItems, fetchCart, addItem, removeItem, clearCart} = useCart();
  const {placeOrder, currentOrder} = useOrder();
  const authHeaders = useAuthHeaders();
  const{user} = useAuth();
  const navigate = useNavigate();
  const items = Object.values(cartItems);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const stripePromise = loadStripe("pk_test_51S3XSLECvSWcQh9Dj460G1B6yy5ygkw5FOcQF4MDiKANnrpljxaGGmbusrNR9DT5boSuBcxPp5vBkOiKu37uyKoq00eMTV8bZH");

  const order = {
    items: items,
    totalAmount: total
  }
  localStorage.setItem("pendingOrder", JSON.stringify(order));

  console.log(items);
  const handlePlaceOrder = async ()=>{
    try {
      const res = await fetch("http://localhost:8080/api/payment/checkout",
        {
          method: "POST",
          headers : authHeaders,
          body: JSON.stringify(order),
        }
      )

      if(!res.ok){
        throw new Error("Failed to create checkout session");
      }
      const data = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Payment Error: ",error);
      alert("Something went wrong with payment......");
    }
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold">Your cart is empty 🛒</h2>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => navigate("/")}
        >
          Explore Restaurants
        </button>
      </div>
    );
  }
  return (
    <div className="mx-60 mt-10">
      <h1 className="text-3xl font-bold mb-5">Your Cart</h1>
      {items.map((item) => (
          <div key={item.itemId} className="flex justify-between items-center bg-white shadow-md p-4 mb-3 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={ITEM_LOGO + item.imageId}
                  alt={item.name}
                  className="h-20 w-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">₹{item.price / 100}</p>
                </div>
              </div>
          
              <div className="flex items-center">
                <button
                  className="text-lg px-2 text-green-600 font-bold"
                  onClick={() => removeItem(item.itemId)}
                >
                  -
                </button>
                <span className="mx-3 font-semibold">{item.quantity}</span>
                <button
                  className="text-lg px-2 text-green-600 font-bold"
                  onClick={()=>addItem(item)}
                >
                  +
                </button>
              </div>
          </div>
      ))}
      <div className="text-right mt-6">
        <h2 className="text-xl font-bold">Total: ₹{total / 100}</h2>
        <div className="flex justify-between">
            <button onClick={()=> clearCart()} className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"> 
              Clear Cart
            </button>
            <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              onClick={()=> handlePlaceOrder(order)}
            >
              Proceed to Checkout
            </button>
            
        </div>
      </div>
    </div>
  );
}   

export default Cart;