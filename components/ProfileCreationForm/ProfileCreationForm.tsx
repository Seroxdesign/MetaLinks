"use client";

import React, { useState } from "react";

import SubmitLinksSection from "./SubmitLinksSection";
import UserMetaDetailsSection, {
  TUserMetaDetails,
} from "./UserMetaDetailsSection";

const ProfileCreationForm = () => {
  const [userMetaDetails, setUserMetaDetails] = useState<TUserMetaDetails>({
    username: "",
    bio: "",
    profileImage: "",
    backgroundImage: "",
  });
  const [isSubmitLinksSection, setIsSubmitLinksSection] = useState(false);
  const [linksData, setLinksData] = useState([
    {
      icon: "",
      name: "",
      url: "",
    },
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", e);
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
          <SubmitLinksSection
            linksData={linksData}
            setLinksData={setLinksData}
            onClickPrevBtn={() => setIsSubmitLinksSection(false)}
          />
        )}
      </form>
    </div>
  );
};

export default ProfileCreationForm;
