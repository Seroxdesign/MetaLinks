"use client";

import { Label } from "@radix-ui/react-label";
import { GradiantSeparatorLine } from "./GradiantComponents";
import LabelInputContainer from "./LabelInputContainer";
import { Input } from "../ui/input";
import { IconCirclePlus, IconTrash, IconIcons } from "@tabler/icons-react";
import Image from "next/image";

export type TLink = {
  icon: any;
  name: string;
  url: string;
};

const SubmitLinksSection = ({
  onClickPrevBtn,
  linksData,
  setLinksData,
}: {
  onClickPrevBtn: () => void;
  linksData: TLink[];
  setLinksData: (linksData: TLink[]) => void;
}) => {
  const handleChange = (index: number, field: keyof TLink, value: any) => {
    const updatedLinksData = linksData.map((linkData, i) =>
      i === index ? { ...linkData, [field]: value } : linkData
    );
    setLinksData(updatedLinksData);
  };

  const handleAddLink = () => {
    setLinksData([...linksData, { icon: "", name: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinksData = linksData.filter((_, i) => i !== index);
    setLinksData(updatedLinksData);
  };

  return (
    <>
      <div className="flex flex-col space-y-4 w-full">
        <Label className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Submit Links Here
        </Label>
        <GradiantSeparatorLine />
        <div className="flex flex-col gap-4 relative">
          {linksData.map((linkData, index) => (
            <div className="flex items-center gap-4" key={index}>
              {/* Icon Upload */}
              <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-md">
                <label
                  htmlFor={`icon-${index}`}
                  className="flex items-center justify-center w-full h-full cursor-pointer"
                >
                  {linkData.icon ? (
                    <Image
                      className="w-12 h-12 rounded-md"
                      src={URL.createObjectURL(linkData.icon)}
                      alt="Icon"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <IconIcons className="w-12 h-12 text-neutral-800 dark:text-neutral-300" />
                  )}
                </label>
                <Input
                  id={`icon-${index}`}
                  name={`icon-${index}`}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    handleChange(
                      index,
                      "icon",
                      e.target.files && e.target.files[0]
                    )
                  }
                />
              </div>

              {/* Name and URL Input */}
              <div className="flex flex-col gap-1 flex-grow">
                <LabelInputContainer>
                  <Label htmlFor={`name-${index}`} className="text-xs">
                    Name
                  </Label>
                  <Input
                    id={`name-${index}`}
                    placeholder=""
                    type="text"
                    value={linkData.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor={`url-${index}`} className="text-xs">
                    URL
                  </Label>
                  <Input
                    id={`url-${index}`}
                    placeholder=""
                    type="text"
                    value={linkData.url}
                    onChange={(e) => handleChange(index, "url", e.target.value)}
                  />
                </LabelInputContainer>
              </div>

              {/* Delete Icon */}
              <IconTrash
                className="w-4 h-4 cursor-pointer text-neutral-800 dark:text-neutral-300"
                onClick={() => handleRemoveLink(index)}
              />
            </div>
          ))}
        </div>

        {/* Add more links button */}
        <button
          className="bg-gray-800 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center w-full"
          onClick={handleAddLink}
        >
          <IconCirclePlus className="w-6 h-6 mr-2" /> Add more links
        </button>

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
