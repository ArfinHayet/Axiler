'use client'

import { useForm, SubmitHandler } from "react-hook-form"
import AdminHeader from "@/components/AdminHeader";
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useAddNewProduct, useUploadFile } from "./viewmodels/useProductVM";
import toast from "react-hot-toast";
import { ProductProps } from "@/app/products/models/Products";
import { useState } from "react";

export default function Home() {

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ProductProps>()

    const { mutate: fileUpload } = useUploadFile();

    const { mutate: addNew, isPending, isSuccess, isError } = useAddNewProduct();


    const onSubmit: SubmitHandler<ProductProps> = (data: ProductProps) => {
        console.log("Form submitted:", data)
        const toastId = toast.loading("Adding new product; ...");
        addNew(data, {
            onSuccess: (res: ProductProps[]) => {
                console.log("Response", res)
                // set uploaded URL into react-hook-form state
                toast.success("Product added successfully", { id: toastId })
            },

            onError: () => {
                toast.error("Something went wrong", { id: toastId })
            }
        });
    }

    const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a preview URL
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string); // type-safe
        };
        reader.readAsDataURL(file); // base64

        const toastId = toast.loading("Uploading file ...");
        // call mutate with the file
        fileUpload(file, {
            onSuccess: (res: string) => {
                // set uploaded URL into react-hook-form state
                setValue("image", res);
                toast.success("File upload successfully", { id: toastId })
                reset();
            },
        });
    };

    return (
        <>
            <AdminHeader />
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h1 className="text-dark/40 text-xl font-bold mb-6">Add New Product</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-12">
                        <div className="border-b border-white/10 pb-12">
                            <h2 className="text-base/7 font-semibold text-dark/40">Product Information</h2>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                {/* Name */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="name" className="block text-sm/6 font-medium text-dark/40">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Product name"
                                        {...register("name", { required: "Name is required" })}
                                        className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark/40 
                                        placeholder:text-gray-500 outline-1 -outline-offset-1 outline-black/20 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                    {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
                                </div>

                                {/* Category */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="category" className="block text-sm/6 font-medium text-dark/40">
                                        Category
                                    </label>
                                    <input
                                        id="category"
                                        type="text"
                                        placeholder="Category"
                                        {...register("category", { required: "Category is required" })}
                                        className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark/40 
                                        placeholder:text-gray-500 outline-1 -outline-offset-1 outline-black/20 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                    {errors.category && <p className="text-red-400 text-sm">{errors.category.message}</p>}
                                </div>

                                {/* Price */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="price" className="block text-sm/6 font-medium text-dark/40">
                                        Price
                                    </label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register("price", { required: "Price is required", valueAsNumber: true })}
                                        className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark/40 
                                        placeholder:text-gray-500 outline-1 -outline-offset-1 outline-black/20 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                    {errors.price && <p className="text-red-400 text-sm">{errors.price.message}</p>}
                                </div>

                                {/* Description */}
                                <div className="col-span-full">
                                    <label htmlFor="description" className="block text-sm/6 font-medium text-dark/40">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        placeholder="Write a few details about the product..."
                                        {...register("description")}
                                        className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark/40 
                                        placeholder:text-gray-500 outline-1 -outline-offset-1 outline-black/20 
                                        focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>

                                {/* Image */}
                                <div className="col-span-full">
                                    <label htmlFor="image" className="block text-sm/6 font-medium text-dark/40">
                                        Product Image
                                    </label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-black/25 px-6 py-10">
                                        <div className="text-center">
                                            {imagePreview ? <img src={imagePreview} className="w-50" /> :
                                                <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-600" />}

                                            <div className="mt-4 flex text-sm/6 text-gray-400">
                                                <label
                                                    htmlFor="image"
                                                    className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 
                                                    focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
                                                >

                                                    <span>Upload a file</span>
                                                    <input
                                                        id="image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={fileUploadHandler}
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>

                                            <p className="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-dark/40">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-dark/40 
                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
