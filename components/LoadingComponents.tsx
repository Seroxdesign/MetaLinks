import { cn } from "@/lib/utils";
import ThreeDotsLoader from "./ThreeDotsLoader";

type TLoader = {
  className?: string;
};

export const ThreeDotsLoaderComponent = ({ className }: TLoader) => (
  <div
    className={cn("fixed inset-0 flex justify-center items-center", className)}
  >
    <ThreeDotsLoader className="w-[80px] h-[46px]" />
  </div>
);
