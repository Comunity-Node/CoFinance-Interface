"use client";
import React from "react";
import Link from "next/link";

const Navbar = () => {

    return (
        <div className="navbar fixed bg-black z-50 py-5">
            <div className="navbar-start">
                <Link href={"/"} className="btn btn-ghost text-xl font-normal font-rubik">CoFinance</Link>
            </div>
            <div className="navbar-center space-x-10 bg-transparent font-normal">
                <ul className="menu menu-horizontal px-1 space-x-8 font-semibold text-md">
                    <li><Link href={'/portofolio'}>Portfolio</Link></li>
                    <li><Link href={'/borrow'}>Borrow</Link></li>
                    <li><Link href={'/swap'}>Trade</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                {/* Do Nothing */}
            </div>
        </div >
    );
};

export default Navbar;
