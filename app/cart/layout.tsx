import { PropsWithChildren } from "react";

import Socials from "@/components/templates/socials";

function CartLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Socials />
    </>
  );
}

export default CartLayout;
