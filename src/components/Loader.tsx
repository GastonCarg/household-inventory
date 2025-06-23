import { Loader2 } from "lucide-react";

const Loader: React.FC<{ hasMoreItems?: boolean }> = ({ hasMoreItems }) => {
  return (
    <div
      className="flex items-center justify-center overflow-y-hidden"
      style={!hasMoreItems ? { height: "calc(100vh - 64px)" } : { height: "48px"}}
    >
      <Loader2 className="animate-spin" size={!hasMoreItems ? 70 : 30} />
    </div>
  );
};

export default Loader;
