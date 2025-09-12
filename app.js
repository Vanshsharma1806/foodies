import React from "react"
import ReactDOM from "react-dom/client"
import Header from "./src/components/Header";
import Body from "./src/components/Body";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import About from "./src/components/About";
import Contact from "./src/components/contact";
import Error from "./src/components/Error";
import ResMenu from "./src/components/ResMenu";
import Login from "./src/components/Login";
import Signup from "./src/components/Signup";
import { AuthProvider } from "./src/context/AuthContext";
import ProtectedRoute from "./src/components/ProtectedRoute";
import { CartProvider } from "./src/context/CartContext";
import Cart from "./src/components/Cart";
import { OrderProvider } from "./src/context/OrderContext";
import OrderStatus from "./src/components/OrderStatus";
import PaymentCancel from "./src/components/PaymentCancel";
import PaymentSuccess from "./src/components/PaymentSuccess";

const AppLayout = ()=>{

    return <div className="app-layout  bg-gray-200">
        <Header/>
        <Outlet/>
    </div>
}

const appRouter  = createBrowserRouter([
    {
        path:"/",
        element:<AppLayout/>,
        children: [
            {
                path:"/",
                element:(
                    <ProtectedRoute>
                        <Body/>
                    </ProtectedRoute>
                ),
            },
            {
                path:"/about",
                element:(
                    <ProtectedRoute>
                        <About/>
                    </ProtectedRoute>
                ),
            },
            {
                path:"/success",
                element:(
                    <ProtectedRoute>
                        <PaymentSuccess/>
                    </ProtectedRoute>
                ),
            },
            {
                path:"/cancel",
                element:(
                    <ProtectedRoute>
                        <PaymentCancel/>
                    </ProtectedRoute>
                ),
            },
            {
                path:"/contact",
                element:(
                    <ProtectedRoute>
                        <Contact/>
                    </ProtectedRoute>
                ),
            },
            {
                path:"/restaurant/:resId",
                element:(
                    <ProtectedRoute>
                        <ResMenu/>
                    </ProtectedRoute>
                ),
            },
            {
                path:"/login",
                element:<Login/>
            },
            {
                path:"/signup",
                element:<Signup/>
            },
            {
                path:"/cart",
                element: <Cart/>
            },{
                path: "/order/:orderId",
                element: <OrderStatus/>
            }
        ],
        errorElement:<Error/>,
    },
   
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <OrderProvider>
            <CartProvider>
                <RouterProvider router={appRouter}/>
            </CartProvider>
        </OrderProvider>
    </AuthProvider>
)