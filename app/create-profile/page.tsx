"use client";

import ProfileCreationForm from "@/components/ProfileCreationForm/ProfileCreationForm";
import { Suspense } from "react";

const ProfileCreationComponent = () => {
  return (
    <main className="mt-16">
      <ProfileCreationForm />
    </main>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense>
      <ProfileCreationComponent />
    </Suspense>
  );
};

export default Page;
