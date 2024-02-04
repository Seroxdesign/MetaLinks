import React from "react";

import Link from "next/link";

export const SocialLinksContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex overflow-hidden justify-around items-center gap-x-2 gap-y-2 my-2  max-md:grid max-md:auto-cols-[1fr] max-md:gap-x-2 max-md:gap-y-2 max-md:grid-cols-[1fr_1fr] max-md:grid-rows-[auto_auto]">
      {children}
    </div>
  );
};

export const SocialLinkItem = ({
  url,
  name,
}: {
  url: string;
  name: string;
}) => {
  return (
    <Link
      className="flex font-semibold w-full min-h-14 justify-center items-center bg-lightBlackBg transition-[background-color] duration-300 ease-[ease-out] text-white text-lg leading-6 text-center tracking-[-0.01em] px-6 py-4 rounded-[99px]"
      href={url}
    >
      {name}
    </Link>
  );
};
