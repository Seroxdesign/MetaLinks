"use client";

import ProfileCreationForm from "@/components/ProfileCreationForm/ProfileCreationForm";
import { BackgroundBeams } from "@/components/background-beams";
import { Suspense } from "react";

const ProfileCreationComponent = () => {
  return (
    <main>
      <div className="mt-16">
        <ProfileCreationForm />
      </div>
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
