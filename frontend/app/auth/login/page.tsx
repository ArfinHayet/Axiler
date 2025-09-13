"use client";

import { useForm } from "react-hook-form";
import { LoginFormValues, LoginResponseProps } from "../models/loginFormProps";
import { useLogin } from "../viewmodels/useAuthVM";
import { useLocalStorage } from "@/lib/utils/useLocalStorage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();


  const { mutate, isPending, isSuccess, isError } = useLogin()
  const router = useRouter();

  const onSubmit = (data: LoginFormValues) => {
    const toastId = toast.loading("Logging in...");
    try {
      mutate(data, {
        onSuccess: (res: LoginResponseProps) => {
          if (res.code === 401) {
            toast.error(res.message || "Something went wrong", { id: toastId });
          }
          else {
            toast.success(res.message, { id: toastId });
            useLocalStorage.setItem("token", res.data.access_token as LoginResponseProps['data']['access_token']);
            router.push('/');
          }
        },

        onError: (err: unknown) => {
          toast.error((err as Error).message || "Something went wrong", { id: toastId });
        },
      });
    } catch (err) {
      console.log(err)
    }
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
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Email Field */}
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

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-dark"
              >
                Password
              </label>
              {/* <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div> */}
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?{" "}
          <Link
            href={'/auth/register'}
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Create An Account
          </Link>
        </p>
      </div>
    </div>
  );
}
