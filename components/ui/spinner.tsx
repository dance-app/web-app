export const Spinner = ({ className = "" }) => {
  const defaultClasses = "flex items-center justify-center min-h-screen";

  return (
    <div className={`${defaultClasses} ${className}`}>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  );
};
