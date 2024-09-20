"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import Link from "next/link";
import { FaDiscord, FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Navbar = () => {
    const [active, setActive] = useState<string | null>(null);

    return (
        <div className="navbar fixed bg-black z-50">
            <div className="navbar-start">
                <Link href={"/"} className="btn btn-ghost text-xl font-normal font-rubik">CoFinance</Link>
            </div>
            <div className="navbar-center space-x-10 bg-transparent font-normal">
                <Menu setActive={setActive}>
                    {/* <Link href={"/"}>
                        <MenuItem setActive={setActive} active={active} item="Home">
                        </MenuItem>
                    </Link> */}
                    <Link href={"/portofolio"}>
                        <MenuItem setActive={setActive} active={active} item="Portofolio">
                        </MenuItem>
                    </Link>
                    <Link href={"/borrow"}>
                        <MenuItem setActive={setActive} active={active} item="Borrow">
                        </MenuItem>
                    </Link>
                    <Link href={"/swap"}>
                        <MenuItem setActive={setActive} active={active} item="Trade">
                        </MenuItem>
                    </Link>
                    <MenuItem setActive={setActive} active={active} item="Earn">
                        <div className="grid grid-cols-2 gap-8 px-2 bg-gradient-to-b bg-transparent shadow-lg rounded-md">
                            {/* Pools Section */}
                            <div className="space-y-2">
                                <p className="text-gray-500 font-normal mb-2 font-10">Pools</p>
                                <HoveredLink href="/staking">Staking Pools</HoveredLink>
                                <HoveredLink href="/pool">Pool</HoveredLink>
                                <HoveredLink href="/tokenstake">Token Staking</HoveredLink>
                            </div>

                            {/* Extras Section */}
                            <div className="space-y-2">
                                <p className="text-gray-500 font-normal mb-2">Extras</p>
                                <HoveredLink href="/faucet">Faucet</HoveredLink>
                            </div>
                        </div>
                        <div className="flex w-full flex-col px-2">
                            <div className="divider divider-neutral"></div>
                        </div>
                        <div className="flex items-center justify-between gap-8 px-2 bg-gradient-to-b bg-transparent shadow-lg rounded-md ">
                            {/* Caption Section */}
                            <div className="flex items-center">
                                <p className="text-gray-300 font-medium">Connect With Us</p>
                            </div>

                            {/* Sosmed Section */}
                            <div className="flex items-center space-x-4 ">
                                <FaDiscord className="cursor-pointer" />
                                <FaXTwitter className="cursor-pointer" />
                                <FaTelegram className="cursor-pointer" />
                            </div>
                        </div>
                    </MenuItem>
                </Menu>
            </div>
            <div className="navbar-end">
            </div>
        </div >
    );
};

export default Navbar;
