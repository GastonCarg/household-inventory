import GenericCard from "@/components/GenericCard";
import ItemsList from "./items/page";

const Home = () => {
  return (
    // TODO: Add i18n to translation
    <>
      <div className="grid grid-cols-3 gap-4 p-4">
        <GenericCard title="Total items" count="20" color="black" />
        <GenericCard title="Expiring soon" count="6" color="orange" />
        <GenericCard title="Expired" count="3" color="red" />
      </div>
      <div className="grid gap-4 p-4">
        <ItemsList />
      </div>
    </>
  );
};

export default Home;
