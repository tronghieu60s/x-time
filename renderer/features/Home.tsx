import { Tabs } from "flowbite-react";
import ShopeeHome from "./ecoms/shopee/ShopeeHome";

export default function HomeFeature() {
  return (
    <div className="container mx-auto px-2 py-4">
      <Tabs.Group aria-label="Default tabs" style="default">
        <Tabs.Item active title="Shopee">
          <ShopeeHome />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
