import React from "react";
import Image from "next/image";
import { Input } from "../ui/input";

import LabelInputContainer from "./LabelInputContainer";
import { GradiantSeparatorLine } from "./GradiantComponents";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useMediaUploadErrorHandler } from "@/lib/hooks/useMediaErrorHandler";

export type TUserMetaDetails = {
  username: string;
  bio: string;
  profileImage: any;
  backgroundImage: any;
};

const UserMetaDetailsSection = ({
  onClickNextBtn,
}: {
  onClickNextBtn: () => void;
}) => {
  const form = useFormContext();
  const { mediaUploadErrorHandler } = useMediaUploadErrorHandler();
  return (
    <>
      <div className="mb-8 relative">
        {/* Background Image */}
        <FormField
          control={form.control}
          name="backgroundImage"
          render={({ field }) => (
            <FormItem>
              <Image
                className="rounded-lg !h-[200px] shadow-xl dark:shadow-gray-800"
                src={
                  field.value
                    ? URL.createObjectURL(field.value)
                    : "/DefaultBackgroundImage.png"
                }
                alt="default background image"
                height="200"
                width="576"
              />
              <FormLabel className="absolute top-2 right-0 w-10 h-10 border-white cursor-pointer">
                <Image
                  src="/Camera.png"
                  alt="image description"
                  height="25"
                  width="25"
                />
                <FormControl>
                  <Input
                    type="file"
                    className="hidden"
                    {...field}
                    value={undefined}
                    onChange={(e) => {
                      const isValid = mediaUploadErrorHandler({
                        file: e.target.files && e.target.files[0],
                        name: "backgroundImage",
                      });
                      if (!isValid) return;
                      field.onChange(e.target.files && e.target.files[0]);
                    }}
                    accept={["jpeg", "jpg", "png"].join(", ")}
                  />
                </FormControl>
              </FormLabel>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Image */}
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem className="mb-8 absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
              <div className="relative flex flex-col items-center">
                <Image
                  className="rounded-full w-[120px] h-[120px] border-white border-2"
                  src={
                    field.value
                      ? URL.createObjectURL(field.value)
                      : "/DefaultProfilePicture.png"
                  }
                  alt="Profile Picture"
                  width={120}
                  height={120}
                />
                <FormLabel className="absolute top-0 left-0 w-full h-full cursor-pointer">
                  <FormControl>
                    <Input
                      type="file"
                      className="hidden"
                      {...field}
                      value={undefined}
                      onChange={(e) => {
                        const isValid = mediaUploadErrorHandler({
                          file: e.target.files && e.target.files[0],
                          name: "profileImage",
                        });
                        if (!isValid) return;
                        field.onChange(e.target.files && e.target.files[0]);
                      }}
                      accept={["jpeg", "jpg", "png"].join(", ")}
                    />
                  </FormControl>
                </FormLabel>
                <FormMessage className="mt-1" />
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-4 pt-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username" className="font-bold text-xs">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  id="username"
                  placeholder="Tyler"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <LabelInputContainer>
                <FormLabel htmlFor="bio" className="font-bold text-xs">
                  Bio
                </FormLabel>
                <FormControl>
                  <textarea
                    id="bio"
                    placeholder="Durden"
                    {...field}
                    className="py-4 px-4 rounded-md border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border-input sm:text-sm bg-transparent"
                  />
                </FormControl>
              </LabelInputContainer>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Next Button */}
      <button
        className="bg-gradient-to-br right-0 absolute px-4 group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-fit text-white rounded-md h-8 font-medium text-xs mt-8 cursor-pointer"
        onClick={onClickNextBtn}
      >
        Next &rarr;
      </button>

      <GradiantSeparatorLine className="mt-24" />
    </>
  );
};

export default UserMetaDetailsSection;
