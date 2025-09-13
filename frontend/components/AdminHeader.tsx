"use client";

import { useLocalStorage } from '@/lib/utils/useLocalStorage';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const navigation = [
        { name: 'Home', href: '/admin', current: true }
    ];

    function classNames(...classes: (string | false | null | undefined)[]): string {
        return classes.filter(Boolean).join(' ');
    }

    useEffect(() => {
        if (useLocalStorage.getItem("adminToken")) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        useLocalStorage.removeItem("adminToken");
        setIsLoggedIn(false);
        router.push("/admin/login"); // redirect to /admin
    };

    return (
        <Disclosure
            as="nav"
            className="relative bg-black-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 shadow-md"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-black/40 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>

                    {/* Logo + Nav */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current ? 'bg-gray-950/50 text-black/40' : 'text-dark hover:bg-white/5 hover:text-black/40',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Login / Logout Button */}
                    <div className="flex items-center gap-x-4">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-black/40 hover:text-gray-300"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href={"/admin/login"}
                                className="text-sm font-semibold text-black/40 hover:text-gray-300"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-950/50 text-black/40' : 'text-dark hover:bg-white/5 hover:text-black/40',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                    {/* Mobile Login / Logout */}
                    {isLoggedIn ? (
                        <DisclosureButton
                            onClick={handleLogout}
                            className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-black/40 hover:bg-white/5"
                        >
                            Logout
                        </DisclosureButton>
                    ) : (
                        <Link
                            href={"/admin/login"}
                            className="block rounded-md px-3 py-2 text-base font-medium text-black/40 hover:bg-white/5"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
