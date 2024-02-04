"use client";

import React from "react";
import { FadeIn } from "./FadeIn";
import { ModeToggle } from "@/components/ModeToggle";

const MenuItems = [
  {
    name: "home.",
    link: "#home",
  },
  {
    name: "contact.",
    link: "#contact",
  },
];

function Navbar() {
  return (
    <div>
      <FadeIn>
        <div className="font-bold flex max-w-7xl justify-between max-sm:justify-center items-center bg-lightBlackBg mx-auto px-8 py-4 max-lg:mx-2 rounded-[999px] mt-6">
          <span className="flex items-center text-lg leading-6 -translate-x-[0.01em] text-white">
            <img
              alt="meta link logo"
              src="https://i.imgur.com/tQfcTRL.png"
              className="h-10 w-10"
            />
            MetaLink
          </span>
          <div className="flex justify-end items-center gap-x-8 gap-y-8 max-md:gap-3 max-sm:hidden">
            {MenuItems.map((menuItem) => (
              <a
                key={menuItem.link}
                href={menuItem.link}
                className={`md:w-[120px] transition-all duration-300 text-lightBlackTxt text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0 hover:text-white ${
                  menuItem.link === "#home" ? "text-white" : ""
                }`}
              >
                {menuItem.name}
              </a>
            ))}
            <ModeToggle />
          </div>
        </div>

        <div className="flex w-full justify-center items-center sm:hidden">
          <div className="flex justify-around items-center gap-x-8 gap-y-8 max-w-7xl  bg-lightBlackBg px-8 py-4 rounded-full fixed bottom-5 mx-auto">
            {MenuItems.map((menuItem) => (
              <a
                key={menuItem.link}
                href={menuItem.link}
                className={`md:w-[120px] transition-all duration-300 text-lightBlackTxt text-lg leading-6 text-center tracking-[-0.01em] px-6 max-md:px-2 py-0 hover:text-white ${
                  menuItem.link === "#home" ? "text-white" : ""
                }`}
              >
                {menuItem.name}
              </a>
            ))}
            <ModeToggle />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default Navbar;
