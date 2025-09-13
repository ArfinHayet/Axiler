"use client";

import Header from "@/components/Header";
import { useSingleProductVm } from "../viewmodels/useProductVM";
import { useState } from "react";
import { useParams } from "next/navigation";
import Cart from "@/components/Cart";
import { setCartData } from "@/store/cartSlice";
import { CartItem, CartItemArray } from "../models/CartItem";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import RootState from your store file
import { RootState } from "@/store/store";


interface PageProps {
    params: { id: string };
}

export default function ProductDetail() {

    const [isCartOpen, setIsCartOpen] = useState(false);
    const params = useParams(); // get path params
    const id = typeof params.id === "string" ? params.id : ""; // ensure id is a string
    const { product, isLoading } = useSingleProductVm(id);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.data) || [];

    if (isLoading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    // Example rating (0 to 5)
    const rating = 4;

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));


    const addItemToCart = () => {
        const cartItem: CartItem = {
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            price: product.price,
            quantity,
        };

        // Check if item exists in cart
        const existingIndex = cart.findIndex((item) => item.productId === product._id);

        let updatedCart: CartItemArray;
        if (existingIndex !== -1) {
            // Update quantity
            updatedCart = cart.map((item, idx) =>
                idx === existingIndex
                    ? { ...item, quantity: (item.quantity || 0) + quantity }
                    : item
            );
        } else {
            updatedCart = [...cart, cartItem];
        }

        dispatch(setCartData(updatedCart));
        setIsCartOpen(true);
    };

    return (
        <>
            <Header />
            <section className="relative">
                <div className="w-full mx-auto px-4 sm:px-2 lg:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mx-auto max-md:px-2">

                        {/* Product Image */}
                        <div className="img">
                            <div className="img-box w-full max-lg:mx-auto">
                                <img
                                    src={`http://localhost:3000/uploads/${product.image}`}
                                    alt={product.name}
                                    className="max-lg:mx-auto lg:ml-auto w-full h-[100vh] object-cover"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="data w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                            <div className="data w-full max-w-xl">
                                <p className="text-lg font-medium leading-8 text-indigo-600 mb-4">
                                    {product.category}
                                </p>
                                <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2 capitalize">
                                    {product.name}
                                </h2>

                                {/* Price & Rating */}
                                <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                                    <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                                        ${product.price}
                                    </h6>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <svg
                                                key={idx}
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                                    fill={idx < rating ? "#FBBF24" : "#F3F4F6"}
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 text-base font-normal mb-5">
                                    {product.description}
                                </p>

                                {/* Quantity & Add to Cart */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8">
                                    <div className="flex items-center w-full">
                                        <button
                                            onClick={decrement}
                                            className="group py-4 px-6 border border-gray-400 rounded-l-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="font-semibold text-gray-900 cursor-pointer text-lg py-[13px] px-6 w-full sm:max-w-[118px] outline-0 border-y border-gray-400 bg-transparent placeholder:text-gray-900 text-center hover:bg-gray-50"
                                        />
                                        <button
                                            onClick={increment}
                                            className="group py-4 px-6 border border-gray-400 rounded-r-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button onClick={addItemToCart} className="group py-4 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-indigo-100">
                                        Add to cart
                                    </button>
                                </div>

                                {/* Buy Now */}
                                <div className="flex items-center gap-3">
                                    <button onClick={addItemToCart} className="text-center w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <Cart open={isCartOpen} setOpen={setIsCartOpen} />
            </section>
        </>
    );
}
