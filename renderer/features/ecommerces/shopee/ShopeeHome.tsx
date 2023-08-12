import { Tabs } from 'flowbite-react';
import ShopeePromotion from './ShopeePromotion';

export default function ShopeeHome() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs.Group style="fullWidth">
        <Tabs.Item title="Shopee Now"></Tabs.Item>
        <Tabs.Item title="Shopee Sale">
          <ShopeePromotion />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}
