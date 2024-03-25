
import { useRouter } from "next/navigation";
import { HoverBorderGradient } from "@/components/hover-border-gradient";

const ClaimYourProfileButton = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        onClick={() => {
          router.push("https://enter.metagame.wtf/");
        }}
      >
        <span>Claim your profile</span>
      </HoverBorderGradient>
    </div>
  );
}

export default ClaimYourProfileButton;