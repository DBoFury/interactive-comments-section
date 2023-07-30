"use client";

import { Button } from "../ui/button";
import { Icons } from "../Icons";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <Button variant="outline" onClick={() => signOut()}>
      <Icons.logout className="w-4 h-4" />
    </Button>
  );
};

export default Logout;
