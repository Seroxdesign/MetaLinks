import React from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import LabelInputContainer from "./LabelInputContainer";
import { GradiantSeparatorLine } from "./GradiantComponents";

export type TUserMetaDetails = {
  username: string;
  bio: string;
  profileImage: any;
  backgroundImage: any;
};

const UserMetaDetailsSection = ({
  onClickNextBtn,
  userMetaDetails,
  setUserMetaDetails,
}: {
  onClickNextBtn: () => void;
  userMetaDetails: TUserMetaDetails;
  setUserMetaDetails: (userMetaDetails: TUserMetaDetails) => void;
}) => {
  const handleChange = (field: keyof TUserMetaDetails, value: any) => {
    setUserMetaDetails({
      ...userMetaDetails,
      [field]: value,
    });
  };

  return (
    <>
      <div className="mb-8 relative">
        {/* Background Image */}
        <Image
          className="rounded-lg !h-[200px] shadow-xl dark:shadow-gray-800"
          src={
            userMetaDetails.backgroundImage
              ? URL.createObjectURL(userMetaDetails.backgroundImage)
              : "/DefaultBackgroundImage.png"
          }
          alt="default background image"
          height="200"
          width="576"
        />
        <label className="absolute top-2 right-0 w-10 h-10 border-white cursor-pointer">
          <Image
            src="/Camera.png"
            alt="image description"
            height="25"
            width="25"
          />
          <Input
            type="file"
            className="hidden"
            onChange={(e) => {
              handleChange(
                "backgroundImage",
                e.target.files && e.target.files[0]
              );
            }}
          />
        </label>

        {/* Profile Image */}
        <div className="mb-8 absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
          <div className="inline-block relative">
            <Image
              className="rounded-full w-36 h-36 border-white border-2"
              src={
                userMetaDetails.profileImage
                  ? URL.createObjectURL(userMetaDetails.profileImage)
                  : "/DefaultProfilePicture.png"
              }
              alt="Profile Picture"
              width={144}
              height={144}
            />
            <label className="absolute top-0 left-0 w-full h-full cursor-pointer">
              <Input
                id="profile-image"
                name="profile-image"
                type="file"
                className="hidden"
                onChange={(e) =>
                  handleChange(
                    "profileImage",
                    e.target.files && e.target.files[0]
                  )
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Username */}
        <LabelInputContainer>
          <Label htmlFor="username">UserName</Label>
          <Input
            id="username"
            placeholder="Tyler"
            type="text"
            value={userMetaDetails.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </LabelInputContainer>

        {/* Bio */}
        <LabelInputContainer>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            placeholder="Durden"
            value={userMetaDetails.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="py-4 px-4 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </LabelInputContainer>
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
