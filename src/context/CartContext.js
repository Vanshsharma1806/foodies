import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import useAuthHeaders from "../utils/useAuthHeaders";
import { useAuth } from "./AuthContext";


const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState({});
    const {user} = useAuth();
    const authHeaders = useAuthHeaders();

    const fetchCart = async ()=>{
        if(!user?.token) return;
        try{
            const res = await fetch("http://localhost:8080/api/Cart/get-cart",{
                method: "GET",
                headers: authHeaders
            });
            
            if(!res.ok) throw new Error("failed to fetch cart");
            const data = await res.json()

            const itemsMap = {};
            data.itemList.forEach((item) => {
                itemsMap[item.itemId] = item;
            });
            setCartItems(itemsMap);
        }catch(err){
            console.error("cart load error..", err);
        }
    };

    useEffect(()=>{
        fetchCart();
    },[]);


    const addItem = async (item) => {
        if(!user.token) return;
        try{
            const res = await fetch("http://localhost:8080/api/Cart/add-item",
                {
                    method: "POST",
                    headers: authHeaders,
                    body: JSON.stringify(
                        {
                            itemId : item?.id || item?.itemId,
                            name: item.name,
                            price: item.price,
                            imageId : item.imageId,
                        }
                    ),
                }
            );
            if(!res.ok) throw new Error("Failed to add item...")
            const data = await res.json();
            const itemsMap = {};
            data.itemList.forEach((item) => {
                itemsMap[item.itemId] = item;
            });
            setCartItems(itemsMap);
        }catch(err){
            console.error("Add Item Failed : ", err);
        }
    }

    const removeItem = async(itemId) => {
        if(!user.token) return;
        try{
            const res = await fetch(`http://localhost:8080/api/Cart/remove-item/${itemId}`,
                {
                    method: "DELETE",
                    headers: authHeaders,
                }

            )
            if(!res.ok) throw new Error("Failed to Remove Item");
            const data = await res.json()
            const itemsMap = {};
            data.itemList.forEach((item) => {
                itemsMap[item.itemId] = item;
            });
            setCartItems(itemsMap);
        }catch(err){
            console.error("Remove Item Failed..", err);
        }
    }

    const clearCart = async ()=>{
        try{
            const res = await fetch("http://localhost:8080/api/Cart/clear-cart",
                {
                    method: "DELETE",
                    headers: authHeaders,
                }
            );
            setCartItems({});
            fetchCart();
        }catch(err){
            console.error("Clear Cart Failed..", err);
        }
    }

    return (
        <CartContext.Provider value={{cartItems, fetchCart, addItem, removeItem, clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = ()=> useContext(CartContext);