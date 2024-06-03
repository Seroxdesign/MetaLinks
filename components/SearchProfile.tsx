"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import IconSearch from "@/components/IconSearch";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { checkAndReturnAddress } from "@/utils/address";
import ThreeDotsLoader from "./ThreeDotsLoader";

const SearchProfile = ({
  val,
  classname,
}: {
  val?: string;
  classname?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState(val ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [userInputError, setUserInputError] = useState("");
  const router = useRouter();

  const searchProfileBtnHandler = async () => {
    setSubmitting(true);
    const address = await checkAndReturnAddress(searchQuery);
    if (address) router.push(`/${address}`);
    else setUserInputError("Please enter valid ENS or ETH address.");
    setSubmitting(false);
  };

  return (
    <>
      <div
        className={cn(
          "z-50 flex justify-center items-center gap-2 md:flex-row w-full",
          classname
        )}
      >
        <Input
          type="text"
          placeholder="Enter ENS or ETH address"
          className="rounded-xl w-[85%] md:w-[30rem] h-[2.5rem]"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setUserInputError("");
          }}
        />
        <Button
          onClick={searchProfileBtnHandler}
          variant="shimmer"
          size="shimmerLg"
          className="text-sm h-8 w-40 md:h-10"
          disabled={submitting}
        >
          {submitting ? (
            <ThreeDotsLoader className="w-[40px] h-[16px]" />
          ) : (
            <>
              <IconSearch /> Search Profile
            </>
          )}
        </Button>
      </div>
      <Error message={userInputError} />
    </>
  );
};

const Error = ({ message }: { message: string }) => {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-2">{message}</p>;
};

export default SearchProfile;
