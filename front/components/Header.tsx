"use client";

import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Form from 'next/form'
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import useBasketStore from "@/app/(store)/store";

export default function Header() {
  const { user } = useUser();

  const itemCount = useBasketStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey()
      console.log(response)
    } catch (error) {
      console.error(error)
    } 
  }
  return <header>
    <div className="flex flex-wrap items-center justify-between px-4 py-2">
      <Link href="/" className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0">
        My Little Pulga
      </Link>
    <Form action={"/search"} className="w-full sm:w-auto sm:flex-1 sm:mx-4 sm:mt-0 mt-2">
      <input className="bg-gray-100 text-gray-500 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-4xl" type="text" name="query" placeholder="Search for products" />
    </Form>

    <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 md:flex-none">
      <Link 
      href="/basket" 
      className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <TrolleyIcon className="w-6 h-6" />
        <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{itemCount}</span>
        <span>My Basket</span>
      </Link>

      <ClerkLoaded>
        {user && (
          <Link href="/orders" className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <PackageIcon className="w-6 h-6" />
            <span>My orders</span>
          </Link>
        )}

        {user? (
          <div className="flex items-center space-x-2">
            <UserButton />
            <div className="hidden sm:block text-xs">
              <p className="text-gray-400">Welcome Back</p>
              <p className="font-bold">{user.fullName}</p>
            </div>
          </div>
        ) : (
          <SignInButton  mode="modal"/>
        )}

        {user?.passkeys.length === 0 && (
          <button
          onClick={createClerkPasskey}
          className="bg-white hover:bg-blue-700 hover:text-white animate-pulse text-blue-500 font-bold py-2 px-4 rounded border-blue-300 border">
            Create Passkey
          </button>
        )}
      </ClerkLoaded>
    </div>
    </div>

  </header>;
}

