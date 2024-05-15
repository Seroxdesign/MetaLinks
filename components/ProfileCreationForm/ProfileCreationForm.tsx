"use client";

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
import { useAccount } from "wagmi";

const formSchema = z.object({
  username: z.string().min(4, "username should be atlease 4 characters"),
  bio: z.string().optional().default(""),
  profileImage: z.custom<File>((v) => v instanceof File, {
    message: "Profile Image is required",
  }),
  backgroundImage: z
    .custom<File>((v) => v instanceof File)
    .optional()
    .nullable(),
  links: z.array(
    z.object({
      icon: z.any().optional(),
      name: z.string(),
      url: z.string(),
    })
  ),
});

const ProfileCreationForm = () => {
  const { uploadFileToWeb3Storage, isUploading } = useWeb3StorageUtilities();
  const { isConnected, handleConnectWallet } = useConnectWallet();
  const { address, chainId } = useAccount();

  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  const [step, setStep] = useState<"userDetails" | "submitLinks">(
    "userDetails"
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      profileImage: undefined,
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

  const formValues = form.getValues();

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!isConnected && !address) {
        handleConnectWallet();
        return;
      }

      const { backgroundImage, profileImage, links } = values;

      // Upload image to IPFS
      const formImages = {
        profileImage: profileImage,
        backgroundImage: backgroundImage,
        links: links.map((link) => ({
          icon: link.icon,
        })),
      };
      console.log("formImages",formImages)

      //TODO: FIX This later
      // const cid = await uploadFileToWeb3Storage<typeof formImages>({
      //   payload: formImages,
      // });
      // const ipfsUrl = `ipfs://${cid}`;
      // console.log("ipfsUrl:", ipfsUrl);
      // TODO: Create a DB entry in supabase (create tRPC endpoint)
    } catch (error) {
      console.log("error", error);
    }
  };

  // Function to handle Next button click
  const handleNextButtonClick = () => {
    if (!formValues.profileImage || !formValues.username) {
      return;
    }
    setStep("submitLinks");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8">
      <Form {...form}>
        <form
          className="my-8 relative"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          {step === "userDetails" ? (
            <UserMetaDetailsSection onClickNextBtn={handleNextButtonClick} />
          ) : (
            <>
              <SubmitLinksSection
                onClickPrevBtn={() => setStep("userDetails")}
              />
              <button
                className={cn(
                  "bg-gradient-to-br mt-10 flex items-center justify-center gap-1 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600  dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                )}
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? (
                  <i>Uploading...</i>
                ) : (
                  <>
                    {isConnected ? (
                      <p>Create Profile</p>
                    ) : (
                      <p>Connect Wallet</p>
                    )}
                  </>
                )}
                <BottomGradient />
              </button>
            </>
          )}
          {!!errorMsg && (
            <p className="text-md text-red-500 text-center">{errorMsg}</p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ProfileCreationForm;
