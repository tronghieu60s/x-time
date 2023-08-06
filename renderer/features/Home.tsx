import { Tabs } from 'flowbite-react';
import { useCallback, useState } from 'react';
import CookyHome from './ecoms/cooky/CookyHome';
import HasakiHome from './ecoms/hasaki/HasakiHome';
import ShopeeHome from './ecoms/shopee/ShopeeHome';

const tabs = [
  { title: 'Shopee', content: <ShopeeHome /> },
  { title: 'Lazada', content: <div>Lazada</div> },
  { title: 'Cooky', content: <CookyHome /> },
  { title: 'Hasaki', content: <HasakiHome /> },
];

export default function HomeFeature() {
  const [tabSelected, setTabSelected] = useState([0]);

  const onActiveTabChange = useCallback(
    (tab) => {
      const tabIndex = tabSelected.findIndex((item) => item === tab);
      if (tabIndex === -1) setTabSelected([...tabSelected, tab]);
    },
    [tabSelected],
  );

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Tabs.Group style="fullWidth" onActiveTabChange={onActiveTabChange}>
            {tabs.map((tab, index) => (
              <Tabs.Item key={index} title={tab.title}>
                {tabSelected.includes(index) && tab.content}
              </Tabs.Item>
            ))}
          </Tabs.Group>
        </div>
      </div>
    </div>
  );
}
