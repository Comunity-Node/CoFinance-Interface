import Link from 'next/link'
import React from 'react'
import { FaDiscord, FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";


const Footer = () => {
  return (
    <><footer className="footer text-base-content p-10">
      <aside>
        <img src="/logo-new.png" width={96} alt="" />
        <p className='leading-normal'>
          <span className='font-semibold'> DeFi Platform Service Enchancment</span> for who brave enough to break <br />the decentralized freedoms.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Useful Links</h6>
        <a href='/portofolio' className="link link-hover">Portofolio</a>
        <a href='/borrow' className="link link-hover">Borrow</a>
        <a href='/swap' className="link link-hover">Trade</a>
      </nav>
      <nav>
        <h6 className="footer-title">Earn</h6>
        <a href='/pools' className="link link-hover">Pool</a>
        <a href='/staking' className="link link-hover">Staking Pools</a>
        <a href='/tokenstake' className="link link-hover">Token Staking</a>
        <a href='/faucet' className="link link-hover">Faucet</a>
        <a href='/presale' className="link link-hover">Faucet</a>
      </nav>
      <nav>
        <h6 className="footer-title">Our Offices</h6>
        <a className="link link-hover">Digital, Nomad 101 Street</a>
      </nav>

    </footer>
      <footer className="footer bg-black text-neutral-content items-center py-4 px-10">
        <aside className="grid-flow-col items-center">
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <Link target="_blank" href={"https://x.com/cofinancedefi"}>
            <FaDiscord className="cursor-pointer" />
          </Link>
          <Link target="_blank" href={"https://x.com/cofinancedefi"}>
            <FaXTwitter className="cursor-pointer" />
          </Link>
          <Link target="_blank" href={"https://t.me/cofinancecomunity"}>
            <FaTelegram className="cursor-pointer" />
          </Link>
        </nav>
      </footer></>
  )

}


export default Footer