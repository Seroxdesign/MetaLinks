"use client";

import ProfileCreationForm from "@/components/ProfileCreationForm/ProfileCreationForm";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const EditProfileCreationComponent = () => {
  // const router = useParams();
  // const address = router?.address as string;
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
