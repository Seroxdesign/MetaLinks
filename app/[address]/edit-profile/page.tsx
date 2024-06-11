"use client";

import ProfileCreationForm from "@/components/ProfileCreationForm/ProfileCreationForm";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const EditProfileCreationComponent = () => {
  return (
    <main className="mt-16">
      <ProfileCreationForm enableEditing={true} />
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
