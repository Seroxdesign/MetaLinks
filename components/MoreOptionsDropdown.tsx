import {
  HamburgerMenuIcon,
  ClipboardCopyIcon,
  PlusIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function useCopy() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => setIsCopied(true))
        .catch((error) => console.error("Copy to clipboard failed:", error));
    }
  };

  const resetCopyStatus = () => {
    setIsCopied(false);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(resetCopyStatus, 3000); // Reset copy status after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return { isCopied, copyToClipboard, resetCopyStatus };
}

function MoreOptionsDropdownMenu({ username }: { username?: string }) {
  const router = useRouter();
  const { copyToClipboard, isCopied } = useCopy();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full text-black w-[35px] h-[35px] inline-flex items-center justify-center bg-white shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          aria-label="More options"
        >
          <HamburgerMenuIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => {
            copyToClipboard(window.location.href);
          }}
        >
          Copy to clipboard
          <DropdownMenuShortcut>
            <ClipboardCopyIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push(
                username
                  ? `https://metagame.wtf/player/${username}`
                  : "https://metagame.wtf/players"
              );
            }}
          >
            Edit Profile
            <DropdownMenuShortcut>
              <Pencil1Icon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("https://enter.metagame.wtf/");
            }}
          >
            Create Profile
            <DropdownMenuShortcut>
              <PlusIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push("https://chat.metagame.wtf/");
          }}
        >
          Join Discord
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MoreOptionsDropdownMenu;
