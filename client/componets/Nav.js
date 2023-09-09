import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import Link from "next/link";
import { useRouter } from "next/router";

const Nav = () => {
  const [current, setCurrent] = useState();
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const router = useRouter();
  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  return (
    <nav className="nav bg-dark d-flex justify-content-end">
      <li className="nav-item">
        <Link href="/" className="nav-link text-light">
          Home
        </Link>
      </li>

      {state !== null ? (
        <>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle text-bg-dark"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {state && state.user && state.user.name}
            </button>
            <ul className="dropdown-menu">
              {state.user.role === "Admin" && (
                <li>
                  <Link className="nav-link dropwdown-item" href="/admin">
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  className="nav-link dropwdown-item"
                  href="/user/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="nav-link dropwdown-item"
                  href="/user/profile/update"
                >
                  Profile
                </Link>
              </li>

              <li>
                <a onClick={logout} className="nav-link">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <li className="nav-item">
            <Link className="nav-link text-light" href="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" href="/register">
              Register
            </Link>
          </li>
        </>
      )}
    </nav>
  );
};

export default Nav;
