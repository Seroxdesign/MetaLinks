"use client";

import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { BottomGradient, GradiantSeparatorLine } from "./GradiantComponents";
import LabelInputContainer from "./LabelInputContainer";
import { Input } from "../ui/input";
import { IconCirclePlus, IconGhost, IconTrash } from "@tabler/icons-react";

interface Link {
  icon: string;
  name: string;
  url: string;
}

const SubmitLinksSection = ({
  onClickPrevBtn,
}: {
  onClickPrevBtn: () => void;
}) => {
  const [linksData, setLinksData] = useState([
    {
      icon: "",
      name: "",
      url: "",
    },
  ]);

  const handleChange = (index: number, field: keyof Link, value: string) => {
    setLinksData((prevData) =>
      prevData.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    );
  };

  const handleAddLink = () => {
    setLinksData((prevData) => [...prevData, { icon: "", name: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinksData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-col space-y-2 w-full">
        <Label>Submit Links here &darr;</Label>
        <GradiantSeparatorLine />
        <div className="flex flex-col gap-4 relative !mt-4">
          {linksData.map((linkData, index) => {
            const showAddMoreLinksIcon = index === linksData.length - 1;
            return (
              <div className="flex items-end gap-2" key={index}>
                <LabelInputContainer>
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    placeholder=""
                    type="text"
                    value={linkData.icon}
                    onChange={(e) =>
                      handleChange(index, "icon", e.target.value)
                    }
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder=""
                    type="text"
                    value={linkData.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder=""
                    type="text"
                    value={linkData.url}
                    onChange={(e) => handleChange(index, "url", e.target.value)}
                  />
                </LabelInputContainer>
                {showAddMoreLinksIcon ? (
                  <IconCirclePlus
                    className="ml-2 w-16 cursor-pointer text-neutral-800 dark:text-neutral-300"
                    onClick={handleAddLink}
                  />
                ) : (
                  <IconTrash
                    className="w-16 cursor-pointer text-neutral-800 dark:text-neutral-300"
                    onClick={() => handleRemoveLink(index)}
                  />
                )}
              </div>
            );
          })}
        </div>
        <button
          className="bg-gradient-to-br !mt-12 px-4 group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-fit text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          onClick={onClickPrevBtn}
        >
          &larr; Prev
        </button>
      </div>

      <button
        className="bg-gradient-to-br mt-10 flex items-center justify-center gap-1 relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600  dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        <p>Create Profile</p> <IconGhost />
        <BottomGradient />
      </button>
      <GradiantSeparatorLine />
    </>
  );
};

export default SubmitLinksSection;
