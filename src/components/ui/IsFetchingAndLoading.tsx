import { type HTMLAttributes } from "react";
import Spin from "./Spin";

type DivProps = HTMLAttributes<HTMLDivElement>;

const IsFetchingAndLoading = ({ className = "" }: DivProps) => {
  return (
    <div className={`bg-amber-500 flex justify-center ${className}`}>
        <Spin></Spin>
    </div>
  );
};

export default IsFetchingAndLoading;
