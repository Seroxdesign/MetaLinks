"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { GradiantSeparatorLine } from "./GradiantComponents";

import LabelInputContainer from "./LabelInputContainer";

export type TUserMetaDetails = {
  username: string;
  bio: string;
  profileImage: string;
  backgroundImage: string;
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
  const handleChange = (field: keyof TUserMetaDetails, value: string) => {
    setUserMetaDetails({
      ...userMetaDetails,
      [field]: value,
    });
  };
  return (
    <>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="username">UserName</Label>
        <Input
          id="username"
          placeholder="Tyler"
          type="text"
          value={userMetaDetails.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />
      </LabelInputContainer>

      <LabelInputContainer className="mb-4">
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          placeholder="Durden"
          type="text"
          value={userMetaDetails.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
        />
      </LabelInputContainer>

      <LabelInputContainer className="mb-4">
        <Label htmlFor="profile-image">Profile image</Label>
        <Input
          id="profile-image"
          placeholder="a profile image"
          type="text"
          value={userMetaDetails.profileImage}
          onChange={(e) => handleChange("profileImage", e.target.value)}
        />
      </LabelInputContainer>

      <LabelInputContainer className="mb-8">
        <Label htmlFor="background-image">Background image</Label>
        <Input
          id="background-image"
          placeholder="a background image"
          type="text"
          value={userMetaDetails.backgroundImage}
          onChange={(e) => handleChange("backgroundImage", e.target.value)}
        />
      </LabelInputContainer>

      <button
        className="bg-gradient-to-br right-0 absolute px-4  group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-fit text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        onClick={onClickNextBtn}
      >
        Next &rarr;
      </button>

      <GradiantSeparatorLine className="mt-24" />
    </>
  );
};

export default UserMetaDetailsSection;
