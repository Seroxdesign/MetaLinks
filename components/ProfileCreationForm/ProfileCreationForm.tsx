"use client";

// TODO:
// 1) Only upload image to IPFS (DONE)
// 2) Call to supabase (add trpc?)
// 3) Use react hook form (DONE)
// Fix color schemes
// Add connect to wallet while creating profile and get address (DONE)
//

import React, { useState } from "react";

import SubmitLinksSection from "./SubmitLinksSection";
import UserMetaDetailsSection from "./UserMetaDetailsSection";
import { IconGhost } from "@tabler/icons-react";
import { BottomGradient } from "./GradiantComponents";
import { cn } from "@/lib/utils";
import { useWeb3StorageUtilities } from "@/lib/hooks/useWeb3StorageUtilities";
import { useConnectWallet } from "@/lib/hooks/useConnectWallet";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string(),
  bio: z.string(),
  profileImage: z.any(),
  backgroundImage: z.any(),
  links: z.array(
    z.object({
      icon: z.any(),
      name: z.string(),
      url: z.string(),
    })
  ),
});

const ProfileCreationForm = () => {
  const { uploadFileToWeb3Storage } = useWeb3StorageUtilities();
  const { isConnected, handleConnectWallet, isSignedIn, handleSignIn } =
    useConnectWallet();

  const [isSubmitLinksSection, setIsSubmitLinksSection] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      profileImage: null,
      backgroundImage: null,
      links: [
        {
          icon: null,
          name: "",
          url: "",
        },
      ],
    },
  });

  const handleFormSubmit = async () => {
    try {
      if (!isConnected) {
        handleConnectWallet();
      }
      if (!isSignedIn) {
        await handleSignIn();
      }

      const { backgroundImage, profileImage, links } = form.getValues();

      // Upload image to IPFS
      const formImages = {
        profileImage: profileImage,
        backgroundImage: backgroundImage,
        links: links.map((link) => ({
          icon: link.icon,
        })),
      };
      const cid = await uploadFileToWeb3Storage<typeof formImages>({
        payload: formImages,
      });
      const ipfsUrl = `ipfs://${cid}`;
      console.log("ipfsUrl:", ipfsUrl);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8">
      <Form {...form}>
        <form
          className="my-8 relative"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          {!isSubmitLinksSection ? (
            <UserMetaDetailsSection
              onClickNextBtn={() => setIsSubmitLinksSection(true)}
              form={form}
            />
          ) : (
            <>
              <SubmitLinksSection
                onClickPrevBtn={() => setIsSubmitLinksSection(false)}
                form={form}
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
      </Form>
    </div>
  );
};

export default ProfileCreationForm;
