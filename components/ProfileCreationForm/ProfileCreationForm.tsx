"use client";

import React, { useState } from "react";

import SubmitLinksSection from "./SubmitLinksSection";
import UserMetaDetailsSection from "./UserMetaDetailsSection";
import { BottomGradient } from "./GradiantComponents";
import { cn } from "@/lib/utils";
import { useConnectWallet } from "@/lib/hooks/useConnectWallet";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "wagmi";
import { useLogin } from "@/lib/hooks/useLogin";
import { useSupabase } from "@/app/providers/supabase";
import { useW3upClient } from "@/lib/useW3upClient";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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
      icon: z
        .custom<File>((v) => v instanceof File)
        .optional()
        .nullable(),
      name: z.string(),
      url: z.string(),
    })
  ),
});

type TFormSchema = z.infer<typeof formSchema>;

type TLink = {
  name: string;
  url: string;
  icon?: string;
};

type TuploadImagesRes = {
  profileImageIPFS: string;
  backgroundImageIPFS?: string;
  links: Array<TLink>;
};

type TuploadImagesInput = {
  profileImage: TFormSchema["profileImage"];
  backgroundImage?: TFormSchema["backgroundImage"];
  links: TFormSchema["links"];
};

const ProfileCreationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const { isConnected, handleConnectWallet } = useConnectWallet();
  const { address, chainId } = useAccount();
  const { toast } = useToast();
  const router = useRouter();

  const w3storage = useW3upClient();

  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const { supabase } = useSupabase();
  const { login, logout, isLoggedIn, checkLoggedIn, isLoggingIn } = useLogin();

  const [step, setStep] = useState<"userDetails" | "submitLinks">(
    "userDetails"
  );

  const form = useForm<TFormSchema>({
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

  const uploadImageToIPFS = async ({
    profileImage,
    backgroundImage,
    links,
  }: TuploadImagesInput) => {
    const response: TuploadImagesRes = {
      profileImageIPFS: "",
      backgroundImageIPFS: undefined,
      links: [],
    };

    const profileImageCID = await w3storage?.uploadFile(profileImage);

    response.profileImageIPFS = `ipfs://${profileImageCID}`;

    if (!!backgroundImage) {
      const backgroundImageCID = await w3storage?.uploadFile(backgroundImage);
      response.backgroundImageIPFS = `ipfs://${backgroundImageCID}`;
    }

    if (!!links) {
      const results: TLink[] = [];

      for (const link of links) {
        if (link.icon) {
          try {
            const cid = await w3storage?.uploadFile(link.icon);
            results.push({
              name: link.name,
              url: link.url,
              icon: cid ? `ipfs://${cid}` : undefined,
            });
          } catch (err) {
            results.push({ ...link, icon: undefined });
          }
        } else {
          results.push({ ...link, icon: undefined });
        }
      }
      response.links = results;
    }

    return response;
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const loggedIn = await checkLoggedIn();
      let userAddress;
      if (!loggedIn) {
        userAddress = await login();
      }

      const { backgroundImage, profileImage, links, username, bio } = values;

      const {
        profileImageIPFS,
        backgroundImageIPFS,
        links: linksArr,
      } = await uploadImageToIPFS({ backgroundImage, profileImage, links });

      const updatedUser = await supabase
        .from("users")
        .update({
          username,
          bio,
          profileImageIPFS,
          backgroundImageIPFS,
          links: linksArr,
        })
        .eq("address", address ?? (userAddress as string))
        .select();

      toast({
        title: "Success",
        description: "User Profile Created ",
      });

      form.reset();
      router.push(`/${address}`);
      setIsLoading(false);
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
                disabled={isLoading}
              >
                {isLoading ? <i>Loading...</i> : <p>Create Profile</p>}
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
