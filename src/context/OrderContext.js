import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthHeaders from "../utils/useAuthHeaders";



const OrderContext = createContext();

export const OrderProvider = ({children}) => {

    const authHeaders = useAuthHeaders();

    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const BASE_URL = "http://localhost:8080/api/orders";

    const placeOrder = async (orderData)=>{
        setLoading(true);
        try{
            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify(orderData)
            });

            if(!res.ok) throw new Error("Failed to place order");

            const data = await res.json();
            setCurrentOrder(data);
            console.log("order placed");
            return data;
        }catch(err){
            alert(err.msg);
        }finally{
            setLoading(false);
        }  
    }

    const getMyOrders = async ()=>{
        setLoading(true);
        try{
            const res = await fetch(`${BASE_URL}/my-orders`,
                {
                    method: "GET",
                    headers: authHeaders,
                }
            );
            if(!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(data);
            // return data;
        }catch(err){
            alert(err.msg);
        }finally{
            setLoading(false);
        }
    };

    const getOrderById = async (orderId)=>{
        setLoading(true);
        try{
            const res = await fetch(`${BASE_URL}/${orderId}`, {
                method: "GET",
                headers: authHeaders,
            })
            if(!res.ok) throw new Error("Failed to fetch Orders");
            const data = await res.json();
            setCurrentOrder(data);
            return data;
        }catch(err){
            alert(err.msg);
        }finally{
            setLoading(false);
        }
    }

    const updateOrderStatus = async (orderId, status)=>{
        setLoading(true);
        try{
            const res = await fetch(`${BASE_URL}/${orderId}/status/${status}`,{
                method: "PATCH",
                headers: authHeaders,
            });
            if(!res.ok) throw new Error("Failed to fetch order");
            const data = await res.json();
            setCurrentOrder(data);
        }catch(err){
            alert(err.msg);
        }finally{
            setLoading(false);
        }
    }

    return <OrderContext.Provider value={{currentOrder, setCurrentOrder, orders, loading, placeOrder, getMyOrders, getOrderById, updateOrderStatus}}>
        {children}
    </OrderContext.Provider>
};

export const useOrder = ()=> useContext(OrderContext);

