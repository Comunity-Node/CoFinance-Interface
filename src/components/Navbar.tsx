"use client";
import React from "react";
import Link from "next/link";
import { HoveredLink } from "./ui/navbar-menu";
import { FaDiscord, FaTwitter, FaTelegram } from 'react-icons/fa';

const Navbar = () => {

    return (
        <div className="navbar fixed bg-black z-50 py-5">
            <div className="navbar-start">
                <Link href={"/"} className="btn btn-ghost text-xl font-normal font-rubik">
                    <img src="/logo-new.png" width={96} alt="" />
                </Link>
            </div>
            <div className="navbar-center space-x-10 bg-transparent font-normal">
                <ul className="menu menu-horizontal px-1 space-x-8 font-semibold text-md">
                    <li><Link href={'/portofolio'}>Portfolio</Link></li>
                    <li><Link href={'/borrow'}>Borrow</Link></li>
                    <li><Link href={'/swap'}>Trade</Link></li>
                    <li>
                        <div tabIndex={0} role="button" className="dropdown">
                            <p className="">Earn</p>
                            <ul className="dropdown-content menu p-2 bg-black mt-56 rounded-box z-[1] shadow-lg">
                                <div className="grid grid-cols-2 gap-8 p-2 shadow-lg rounded-md">
                                    <div className="space-y-2">
                                        <p className="text-gray-500 font-normal mb-2 font-10">Pools</p>
                                        <HoveredLink href="/staking">Staking Pools</HoveredLink>
                                        <HoveredLink href="/pools">Pool</HoveredLink>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col px-2">
                                    <div className="divider divider-neutral"></div>
                                </div>
                                <div className="flex items-center justify-between gap-8 px-2 pb-2 bg-gradient-to-b bg-transparent shadow-lg rounded-md ">
                                    <div className="flex items-center">
                                        <p className="text-gray-300 font-medium">Connect With Us</p>
                                    </div>
                                    <div className="flex items-center space-x-4 ">
                                        <FaDiscord className="cursor-pointer" href="" />
                                        <FaTwitter className="cursor-pointer" href="" />
                                        <FaTelegram className="cursor-pointer" href="" />
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                {/* Do Nothing */}
            </div>
        </div >
    );
};

export default Navbar;
