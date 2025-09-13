'use client'

import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store';
import Header from '@/components/Header';
import { useCheckout } from './viewmodels/useCheckoutVM'
import { OrderProps } from './models/checkout'
import { useDispatch } from 'react-redux';
import toast from "react-hot-toast";
import { useEffect, useState } from 'react';
import { clearCartData } from '@/store/cartSlice';
import { useLocalStorage } from '@/lib/utils/useLocalStorage';
import Link from 'next/link';

interface OrderProduct {
  productId: string
  productName: string
  productImage?: string
  quantity?: number
  price?: number
}

interface OrderFormData {
  name: string
  address: string
  phone: string
  note?: string
  products: OrderProduct[]
}

export default function Checkout() {

  const dispatch = useDispatch()

  const [totalPrice, setTotalPrice] = useState(0)

  const { mutate, isPending, isSuccess, isError } = useCheckout();

  const products = useSelector((state: RootState) => state.cart.data) || [];

  const { register, reset, handleSubmit } = useForm<OrderFormData>({
    defaultValues: {
      products: [], // you can prefill from cart if needed
    },
  })

  const onSubmit = (data: OrderFormData) => {
    data.products = products;
    console.log('Form payload:', data)
    const toastId = toast.loading("Placing Order ...");
    mutate(data, {
      onSuccess: (res: object) => {
        console.log(res)
        reset();
        dispatch(clearCartData());
        toast.success("Order placed successfully", { id: toastId })
      },

      onError: (err: unknown) => {
        toast.error((err as Error).message || "Something went wrong", { id: toastId });
      },
    });
  }


  useEffect(() => {

    if (products) {
      const totalPrice = products.reduce(
        (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
        0
      );

      setTotalPrice(totalPrice)
    }

  }, [products])

  return (
    <>
      <Header />
      <section className="bg-white py-8 antialiased md:py-16">


        {/* Product Listing Section */}
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Products</h2>

          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white"
              >
                {/* Image */}
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={process.env.NEXT_PUBLIC_API_URL + 'uploads/' + product.productImage}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Price: ${product.price} × {product.quantity}
                  </p>
                </div>

                {/* Subtotal per product */}
                <div className="text-sm font-semibold text-gray-900">
                  ${(product.price ?? 0) * (product.quantity ?? 1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-screen-xl px-4 2xl:px-0"
        >
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            {/* Left section: Delivery Details */}
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Delivery Details
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Your name
                    </label>
                    <input
                      {...register('name', { required: true })}
                      type="text"
                      id="name"
                      placeholder="Bonnie Green"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Your Phone
                    </label>
                    <input
                      {...register('phone', { required: true })}
                      type="text"
                      id="phone"
                      placeholder="+1 555 555 5555"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Address
                    </label>
                    <input
                      {...register('address', { required: true })}
                      type="text"
                      id="address"
                      placeholder="123 Market Street"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="note"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      Note
                    </label>
                    <textarea
                      {...register('note')}
                      id="note"
                      placeholder="Any additional notes..."
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right section: Order Summary */}
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      $ {totalPrice}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-gray-900">
                      $ {totalPrice}
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="space-y-3">


                {useLocalStorage.getItem("token") ?
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full bg-blue-600 items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                  >
                    Proceed to Payment
                  </button> :
                  <Link
                    href={'/auth/login'}
                    className="flex w-full bg-blue-600 items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                  >
                    Login To Continue
                  </Link>
                }
                
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  )
}
