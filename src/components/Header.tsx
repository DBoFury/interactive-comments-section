import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import NavMenu from "./NavMenu";
import Logout from "./auth/Logout";
import type { Session } from "next-auth";

interface HeaderProps {
  session: Session | null;
}

const Header: FC<HeaderProps> = ({ session }) => {
  return (
    <header className="flex items-start justify-between w-full px-4 py-5">
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
        <ul className="hidden"></ul>
        <span className="sm:hidden">{!session ? <NavMenu /> : <Logout />}</span>
      </nav>
    </header>
  );
};

export default Header;
