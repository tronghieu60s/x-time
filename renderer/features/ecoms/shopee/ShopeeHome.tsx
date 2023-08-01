import { Tabs } from 'flowbite-react';
import ShopeePromotion from './ShopeePromotion';

export default function ShopeeHome() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs.Group aria-label="Default tabs" style="fullWidth">
        <Tabs.Item title="Shopee Flash Sale">
          <ShopeePromotion />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
}

