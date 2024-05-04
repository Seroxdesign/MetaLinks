"use client";

import React, { useState } from "react";

import SubmitLinksSection from "./SubmitLinksSection";
import UserMetaDetailsSection from "./UserMetaDetailsSection";

const ProfileCreationForm = () => {
  // const [username, setUsername] = useState("");
  const [isSubmitLinksSection, setIsSubmitLinksSection] = useState(false);

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
          />
        ) : (
          <SubmitLinksSection
            onClickPrevBtn={() => setIsSubmitLinksSection(false)}
          />
        )}
      </form>
    </div>
  );
};

export default ProfileCreationForm;
