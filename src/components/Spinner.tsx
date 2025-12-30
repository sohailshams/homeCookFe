import { cn } from "@/lib/utils";

type SpinnerProps = {
  fullScreen?: boolean;
}
const Spinner: React.FC<SpinnerProps> = ({ fullScreen = true }) => {
  return (
    <div className={cn("z-50 flex items-center justify-center", fullScreen && "fixed inset-0 bg-black/30")}>
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 border-2 border-black border-dashed rounded-full animate-spin-slow"></div>
        <span className="absolute text-black">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
