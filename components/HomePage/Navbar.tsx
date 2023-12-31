import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authState, initialAuthState } from "../../state/atoms";
import { useRecoilState } from "recoil";
import Link from "next/link";
import ProfileImage from "../../public/profile.png"

const Navbar: React.FC = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  console.log("ROute",router,pathName)
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    const token = auth.accessToken?auth.accessToken:localStorage.getItem("accessToken")
    console.log("HEREAANAV",token)
    if (localStorage.getItem("accessToken")?.length !== 0 || auth.accessToken) {
      setIsLogged(true);
    }
  }, []);
  const handleClick = () => {
    console.log("HERELOGGED",isLogged)
    if (isLogged) {
      localStorage.setItem("accessToken", "");
      console.log("NEWVALUE",localStorage.getItem("accessToken"))
      setAuth(initialAuthState);
      if(pathName==="/")
      router.refresh()
      else
      router.push("/");
    } else router.push("/login");
  };
  return (
    <div className="w-full mx-auto bg-white border-b 2xl:max-w-7xl">
      <div className="relative flex flex-col w-full p-5 mx-auto bg-white md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between lg:justify-start">
          <Link href="/">
            <img
              src="icon.png"
              className="w-20 cursor-pointer"
              alt="Home Icon"
            />
          </Link>{" "}
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none focus:text-black md:hidden"
          >
            <svg
              className="w-6 h-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>
        <nav
          className={`flex-col items-center flex-grow md:pb-0 md:flex md:justify-center md:flex-row gap-5 md:ml-44 lg:ml-44 ${
            open ? "flex" : "hidden"
          }`}
        >
          {/* Add other nav links as needed */}
          <Link
            href="/deploy"
            className="px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600"
          >
            Deploy
          </Link>
          <Link
            href="/userDashboard"
            className="px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600"
          >
            User Dashboard
          </Link>
          <Link
            href="/sellerDashboard"
            className="px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600"
          >
            Seller Dashboard
          </Link>

          <div className="inline-flex items-center gap-2 list-none lg:ml-auto">
            <button
              onClick={() => {
                handleClick();
              }}
              className="block px-4 py-2 mt-2 text-sm text-gray-500 md:mt-0 hover:text-blue-600 focus:outline-none focus:shadow-outline"
            >
              {isLogged ? "Sign Out" : "Sign in"}
            </button>
            <Link href="/userProfile">
              <img src={ProfileImage.src} className="w-12 cursor-pointer" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
