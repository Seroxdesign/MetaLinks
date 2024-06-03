"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import IconSearch from "@/components/IconSearch";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { checkAndReturnAddress } from "@/utils/address";
import ThreeDotsLoader from "./ThreeDotsLoader";
import { useForm } from "react-hook-form";
import { Form, FormField } from "./ui/form";

const SearchProfile = ({
  val,
  classname,
}: {
  val?: string;
  classname?: string;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [userInputError, setUserInputError] = useState("");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      searchQuery: val ?? "",
    },
  });

  const searchProfileBtnHandler = async () => {
    setSubmitting(true);
    const searchQuery = form.getValues("searchQuery");
    const address = await checkAndReturnAddress(searchQuery);

    console.log({ address, formValues: form.getValues() });
    if (address) router.push(`/${address}`);
    else setUserInputError("Please enter valid ENS or ETH address.");
    setSubmitting(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-start gap-1",
        classname
      )}
    >
      <Form {...form}>
        <form
          className="z-50 flex justify-center items-center gap-2 md:flex-row w-full"
          onSubmit={form.handleSubmit(searchProfileBtnHandler)}
        >
          <FormField
            control={form.control}
            name="searchQuery"
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                placeholder="Enter ENS or ETH address"
                className="rounded-xl w-[85%] md:w-[30rem] h-[2.5rem]"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setUserInputError("");
                }}
              />
            )}
          />

          <Button
            variant="shimmer"
            size="shimmerLg"
            type="submit"
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
        </form>
      </Form>
      <Error message={userInputError} />
    </div>
  );
};

const Error = ({ message }: { message: string }) => {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-2">{message}</p>;
};

export default SearchProfile;
