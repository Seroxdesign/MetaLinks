interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children, ...props }: WrapperProps) {
  return (
    <div className="max-w-7xl mx-auto max-xl:mx-3" {...props}>
      {children}
    </div>
  );
}

export default Wrapper;
