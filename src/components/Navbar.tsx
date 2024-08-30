import { Nav, NavLink } from "./Nav";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "./AuthButton";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Nav AuthButton={<AuthButton />} showProfile={user}>
      {
        user &&
        <>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/my-favs">My favs</NavLink>
          <NavLink href="/my-docs">My docs</NavLink>
        </>
      }
    </Nav>
  );
}