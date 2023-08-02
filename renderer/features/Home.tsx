import { Tabs } from 'flowbite-react';
import { useEffect } from 'react';
import ShopeeHome from './ecoms/shopee/ShopeeHome';

export default function HomeFeature() {
  useEffect(() => {
    const interval = setInterval(() => {
      //console.log('This will run every second!');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Tabs.Group aria-label="Default tabs" style="fullWidth">
            <Tabs.Item active title="Shopee">
              <ShopeeHome />
            </Tabs.Item>
            <Tabs.Item active title="Lazada"></Tabs.Item>
            <Tabs.Item active title="Hasaki" disabled></Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </div>
  );
}

