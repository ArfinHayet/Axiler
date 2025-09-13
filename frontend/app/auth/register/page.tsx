"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RegistrationFormValues, RegistrationResponseProps } from "../models/registrationFormProps";
import { useRouter } from "next/navigation";
import { useSignup } from "../viewmodels/useAuthVM";
import Link from "next/link";


export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>();

  const router = useRouter();

  const { mutate, isPending, isSuccess, isError } = useSignup()

  const onSubmit = (data: RegistrationFormValues) => {
    const toastId = toast.loading("Registration going in...");
    mutate(data, {
      onSuccess: (res: RegistrationResponseProps) => {
        if (res.code === 401) {
          toast.error(res.message || "Something went wrong", { id: toastId });
        }
        else {
          toast.success(res.message, { id: toastId });
          router.push('/auth/login');
        }
      },

      onError: (err: unknown) => {
        toast.error((err as Error).message || "Something went wrong", { id: toastId });
      },
    });
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href={'/'}>
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto"
          />
        </Link>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-dark"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark outline-1 -outline-offset-1 outline-black/40 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-dark"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark outline-1 -outline-offset-1 outline-black/40 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-dark"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-dark outline-1 -outline-offset-1 outline-black/40 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Already a member?{" "}
          <Link
            href={'/auth/login'}
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
