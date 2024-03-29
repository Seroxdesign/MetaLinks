import { cn } from "@/lib/utils";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

function Wrapper({ children, ...props }: WrapperProps) {
  return (
    <div className={cn("max-w-7xl mx-auto max-xl:mx-3", props.className)}>
      {children}
    </div>
  );
}

export default Wrapper;
