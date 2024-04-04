import React from "react";
import { Outlet } from "react-router-dom";
import App from "../App";

const Layout = () => {
  return (
    <>
      <main className="w-full mx-auto max-w-[800px] mt-[50px]">
        <div>
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
