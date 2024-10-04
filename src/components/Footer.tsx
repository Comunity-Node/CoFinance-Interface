import Link from 'next/link'
import React from 'react'
import { FaEnvelope, FaTelegram } from 'react-icons/fa';

const Footer = () => {
  return (
    <><footer className="footer shadow-xl shadow-gray-400 text-base-content p-10">
      <aside>
        <img src="/logo-new.png" width={96} alt="" />
        <p className='leading-normal'>
          {/* <span className='text-2xl font-bold text-white'>Co-Finance</span> */}
          {/* <br /> */}
          <span className='font-semibold'> DeFi Platform Service Enchancment</span> for who brave enough to break <br />the decentralized freedoms.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Useful Links</h6>
        <a className="link link-hover">Portofolio</a>
        <a className="link link-hover">Borrow</a>
        <a className="link link-hover">Trade</a>
      </nav>
      <nav>
        <h6 className="footer-title">Earn</h6>
        <a className="link link-hover">Pool</a>
        <a className="link link-hover">Staking Pools</a>
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
          <Link href="" className='cursor-pointer'>
            <FaEnvelope width={96} />
          </Link>
          <Link href="" className='cursor-pointer'>
            <FaTelegram width={96} />
          </Link>
        </nav>
      </footer></>
  )

}


export default Footer