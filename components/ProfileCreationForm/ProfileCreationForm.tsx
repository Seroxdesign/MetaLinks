"use client";

// TODO:
// 1) Only upload image to IPFS (DONE)
// 2) Call to supabase (add trpc?)
// 3) Use react hook form
// Fix color schemes
// Add connect to wallet while creating profile and get address (DONE)
//

import React, { useState } from "react";

import SubmitLinksSection, { TLink } from "./SubmitLinksSection";
import UserMetaDetailsSection, {
  TUserMetaDetails,
} from "./UserMetaDetailsSection";
import { IconGhost } from "@tabler/icons-react";
import { BottomGradient } from "./GradiantComponents";
import { cn } from "@/lib/utils";
import { useWeb3StorageUtilities } from "@/lib/hooks/useWeb3StorageUtilities";
import { useConnectWallet } from "@/lib/hooks/useConnectWallet";

const ProfileCreationForm = () => {
  const { uploadFileToWeb3Storage } = useWeb3StorageUtilities();
  const { isConnected, handleConnectWallet, isSignedIn, handleSignIn } =
    useConnectWallet();

  const [userMetaDetails, setUserMetaDetails] = useState<TUserMetaDetails>({
    username: "",
    bio: "",
    profileImage: null,
    backgroundImage: null,
  });
  const [isSubmitLinksSection, setIsSubmitLinksSection] = useState(false);
  const [linksData, setLinksData] = useState<TLink[]>([
    {
      icon: null,
      name: "",
      url: "",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConnected) {
      handleConnectWallet();
    }
    if (!isSignedIn) {
      await handleSignIn();
    }

    // Upload image to IPFS
    const formImages = {
      profileImage: userMetaDetails.profileImage,
      backgroundImage: userMetaDetails.backgroundImage,
      links: linksData.map((link) => ({
        icon: link.icon,
      })),
    };
    const cid = await uploadFileToWeb3Storage<typeof formImages>({
      payload: formImages,
    });
    const ipfsUrl = `ipfs://${cid}`;
    console.log("ipfsUrl:", ipfsUrl);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8">
      <form className="my-8 relative" onSubmit={handleSubmit}>
        {!isSubmitLinksSection ? (
          <UserMetaDetailsSection
            onClickNextBtn={() => setIsSubmitLinksSection(true)}
            userMetaDetails={userMetaDetails}
            setUserMetaDetails={setUserMetaDetails}
          />
        ) : (
          <>
            <SubmitLinksSection
              linksData={linksData}
              setLinksData={setLinksData}
              onClickPrevBtn={() => setIsSubmitLinksSection(false)}
            />
            <button
              className={cn(
                "bg-gradient-to-br mt-10 flex items-center justify-center gap-1 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600  dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              )}
              type="submit"
            >
              <p>Create Profile</p> <IconGhost />
              <BottomGradient />
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ProfileCreationForm;