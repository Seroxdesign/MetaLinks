"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import IconSearch from "@/components/IconSearch";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SearchProfile = ({
  val,
  classname,
}: {
  val?: string;
  classname?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState(val ?? "");
  const router = useRouter();

  return (
    <div
      className={cn(
        "z-50 flex justify-center items-center space-x-2",
        classname
      )}
    >
      <Input
        type="text"
        placeholder="Enter username, name or ethereum address"
        className="rounded-xl w-[30rem] h-[2.5rem]"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          router.push(`/search?query=${searchQuery}`);
        }}
        variant="shimmer"
        size="shimmerLg"
      >
        <IconSearch /> Search Profile
      </Button>
    </div>
  );
};

export default SearchProfile;
