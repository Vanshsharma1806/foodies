import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useOrder } from "../context/OrderContext";


const OrderStatus = ()=>{

    const {getOrderById, loading} = useOrder();
    const {orderId} = useParams();
    const currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
    

    // useEffect(() => {
    //   let intervalId;

    //   const fetchOrder = async () => {
    //     try {
    //       const data = await getOrderById(orderId);
    //       setOrder(data);
    //     } catch (err) {
    //       console.error("Error fetching order:", err);
    //     }
    //   };

    //   if (orderId) {
    //     fetchOrder(); // initial fetch
    //     intervalId = setInterval(fetchOrder, 15000); // re-fetch every 5s
    //   }

    //   // cleanup when component unmounts
    //   return () => clearInterval(intervalId);
    // }, [orderId]);


    if(loading) return <>loading order.........</>
    

    return (
        <div className=" flex justify-center my-10  min-h-screen ">
            <div className="text-center  bg-white shadow-lg rounded-lg w-2/4 h-[400px]">
              <h1 className="font-extrabold my-10  text-4xl ">Order summary</h1>
                <div className="flex flex-col items-center gap-3">
                  <p>Order Id : {currentOrder.id}</p>
                  <p>Order Status : <b> {currentOrder.status}</b></p>
                  <p>Total Amount: <b>₹{currentOrder.totalAmount/100}</b></p>
                  <p>Placed At: {new Date(currentOrder.createdAt).toLocaleString()}</p>
                  <h2>Items</h2>
                  <ul>
                    {currentOrder.items.map((item, idx) => (
                      <li key={idx}>
                        <b>{item.name} - {item.quantity} * ₹{item.price /100}</b>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
        </div>
    )
}
export default OrderStatus;