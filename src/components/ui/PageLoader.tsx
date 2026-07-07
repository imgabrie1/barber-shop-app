import IsFetchingAndLoading from "@/components/ui/IsFetchingAndLoading";

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <IsFetchingAndLoading />
  </div>
);
