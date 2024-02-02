"use client"

import React from 'react';
import { useQuery } from "@apollo/client";
import { profileQuery } from "@/services/apollo";
import { toHTTP } from '@/utils/ipfs';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

const Page: React.FC = () => {
  // Get the address from the router params
  const router = useParams();
  const address = router.address as string;

  // Fetch the profile data using Apollo useQuery hook
  const { loading, error, data } = useQuery(profileQuery, {
    variables: { address },
  });
  
  // Render loading state if data is still loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render error message if user is not found
  if (error || !data?.player[0]) {
    return <p>Error: User not found</p>;
  }
  console.log(data?.player[0])
  // Render the profile information
  return (
    <main>
      <Menubar className='flex items-center justify-space-between height-10 w-full'>
        <Avatar>
          <AvatarImage src="https://i.imgur.com/tQfcTRL.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <h1>MetaLink</h1>
      <img
        src={toHTTP(data?.player[0]?.profile.profileImageURL ?? '')}
        alt="Picture of the author"
      />
      <h2>{data?.player[0]?.profile?.name ?? ''}</h2>
      <p>{data?.player[0]?.profile?.description ?? ''}</p>
      <ul>
        {data?.player[0]?.links.map((link: any, index: number) => (
          <li key={index}>
            <a href={link.url}>{link.name}</a>
          </li>
        ))}
          {data?.player[0]?.guilds.map((guild: any, index: number) => (
          <li key={index}>
            <img src={toHTTP(guild.Guild.logo)} style={{ height: '50px', width: '50px' }} />
            <a href="">{guild.Guild.guildname}</a>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;
