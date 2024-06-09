"use client";

import ProfileCreationForm from "@/components/ProfileCreationForm/ProfileCreationForm";
import { Suspense } from "react";

const EditProfileCreationComponent = () => {
  return (
    <main className="mt-16">
      <ProfileCreationForm />
    </main>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense>
      <EditProfileCreationComponent />
    </Suspense>
  );
};

export default Page;
