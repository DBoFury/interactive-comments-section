"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavMenu from "./NavMenu";
import Logout from "./auth/Logout";
import type { Session } from "next-auth";

interface HeaderProps {
  session: Session | null;
}

const Header: FC<HeaderProps> = ({ session }) => {
  const [isLoading, setIsLoading] = useState<"credentials" | "google" | false>(
    false
  );

  return (
    <header className="w-full">
      <div className="flex items-start justify-between max-w-screen-xl px-4 py-5 mx-auto md:max-w-screen-lg lg:max-w-screen-xl dt:max-w-screen-2xl">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            draggable={false}
            placeholder="empty"
            width={200}
            height={80}
          />
        </Link>
        <nav>
          {!session ? (
            <NavMenu isLoading={isLoading} setIsLoading={setIsLoading} />
          ) : (
            <Logout />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
