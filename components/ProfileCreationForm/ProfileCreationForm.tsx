"use client";

import React, { useState } from "react";

import SubmitLinksSection, { TLink } from "./SubmitLinksSection";
import UserMetaDetailsSection, {
  TUserMetaDetails,
} from "./UserMetaDetailsSection";
import { IconGhost } from "@tabler/icons-react";
import { BottomGradient } from "./GradiantComponents";
import { cn } from "@/lib/utils";
import { useWeb3StorageUtilities } from "@/lib/hooks/useWeb3StorageUtilities";

const ProfileCreationForm = () => {
  const { uploadFileToWeb3Storage } = useWeb3StorageUtilities();
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
    const body = {
      userName: userMetaDetails.username,
      bio: userMetaDetails.bio,
      profileImage: userMetaDetails.profileImage,
      backgroundImage: userMetaDetails.backgroundImage,
      links: linksData.map((link) => ({
        icon: link.icon,
        name: link.name,
        url: link.url,
      })),
    };
    const cid = await uploadFileToWeb3Storage<typeof body>({ payload: body });
    console.log("cid:", cid);
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
