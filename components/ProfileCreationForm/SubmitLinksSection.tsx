"use client";
// TODO: maybe use useFieldArray for links

import { Label } from "@radix-ui/react-label";
import { GradiantSeparatorLine } from "./GradiantComponents";

import { Input } from "../ui/input";
import { IconCirclePlus, IconTrash, IconIcons } from "@tabler/icons-react";
import Image from "next/image";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

export type TLink = {
  icon: any;
  name: string;
  url: string;
};

const SubmitLinksSection = ({
  onClickPrevBtn,
}: {
  onClickPrevBtn: () => void;
}) => {
  const form = useFormContext();

  return (
    <>
      <div className="flex flex-col space-y-4 w-full">
        <Label className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Submit Links Here
        </Label>
        <GradiantSeparatorLine />
        <FormField
          control={form.control}
          name="links"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-4 relative">
                {field.value.map((linkData: TLink, index: number) => (
                  <div className="flex items-center gap-4" key={index}>
                    {/* Icon Upload */}
                    <FormItem className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-md">
                      <FormLabel
                        htmlFor={`icon-${index}`}
                        className="flex items-center justify-center w-full h-full cursor-pointer"
                      >
                        {linkData?.icon ? (
                          <Image
                            className="w-12 h-12 rounded-md"
                            src={URL.createObjectURL(linkData?.icon)}
                            alt="Icon"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <IconIcons className="w-12 h-12 text-neutral-800 dark:text-neutral-300" />
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`icon-${index}`}
                          type="file"
                          className="hidden"
                          {...field.value[index]}
                          value={undefined}
                          onChange={(e) => {
                            linkData.icon = e.target.files && e.target.files[0];
                            field.onChange([
                              ...field.value.map((link: TLink, i: number) =>
                                i === index ? linkData : link
                              ),
                            ]);
                          }}
                          accept={["jpeg", "jpg", "png"].join(", ")}
                        />
                      </FormControl>
                    </FormItem>

                    <FormItem className="flex flex-col gap-1 flex-grow">
                      <div>
                        <FormLabel
                          htmlFor={`name-${index}`}
                          className="text-xs"
                        >
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id={`name-${index}`}
                            placeholder=""
                            type="text"
                            {...field.value[index]}
                            value={field.value[index].name}
                            onChange={(e) => {
                              linkData.name = e.target.value;
                              field.onChange([
                                ...field.value.map((link: TLink, i: number) =>
                                  i === index ? linkData : link
                                ),
                              ]);
                            }}
                          />
                        </FormControl>
                      </div>
                      <div>
                        <FormLabel
                          htmlFor={`name-${index}`}
                          className="text-xs"
                        >
                          URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            id={`name-${index}`}
                            placeholder=""
                            type="text"
                            {...field.value[index]}
                            value={field.value[index].url}
                            onChange={(e) => {
                              linkData.url = e.target.value;
                              field.onChange([
                                ...field.value.map((link: TLink, i: number) =>
                                  i === index ? linkData : link
                                ),
                              ]);
                            }}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                    <FormControl>
                      <IconTrash
                        className="w-4 h-4 cursor-pointer text-neutral-800 dark:text-neutral-300"
                        {...field.value[index]}
                        onClick={() => {
                          field.onChange([
                            ...field.value.filter(
                              (_: any, i: number) => i !== index
                            ),
                          ]);
                        }}
                      />
                    </FormControl>
                  </div>
                ))}
                <FormMessage />
                {/* Add more links button */}
                <FormControl>
                  <button
                    className="bg-gray-800 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center w-full"
                    type="button"
                    {...field}
                    onClick={() => {
                      field.onChange([
                        ...field.value,
                        { icon: null, name: "", url: "" },
                      ]);
                    }}
                  >
                    <IconCirclePlus className="w-6 h-6 mr-2" /> Add more links
                  </button>
                </FormControl>
              </FormItem>
            );
          }}
        />

        {/* Previous button */}
        <button
          className="bg-gradient-to-br mt-2 px-4 group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-fit text-white rounded-md h-8 font-medium text-xs cursor-pointer"
          onClick={onClickPrevBtn}
        >
          &larr; Prev
        </button>
      </div>
      <GradiantSeparatorLine />
    </>
  );
};

export default SubmitLinksSection;
