import { Button, Modal, Tabs } from 'flowbite-react';
import { useCallback, useState } from 'react';
import CookyHome from './ecommerces/cooky/CookyHome';
import HasakiHome from './ecommerces/hasaki/HasakiHome';
import ShopeeHome from './ecommerces/shopee/ShopeeHome';
import AuthLogin from './auth/AuthLogin';
import AuthRegister from './auth/AuthRegister';

const tabs = [
  { title: 'Shopee', content: <ShopeeHome /> },
  { title: 'Lazada', content: <div>Lazada</div> },
  { title: 'Cooky', content: <CookyHome /> },
  { title: 'Hasaki', content: <HasakiHome /> },
];

export default function HomeFeature() {
  const [tabSelected, setTabSelected] = useState([0]);

  const [isRegister, setIsRegister] = useState(false);
  const [isShowLogin, setIsShowLogin] = useState(false);

  const onOpenLogin = useCallback(() => {
    setIsRegister(false);
    setIsShowLogin(true);
  }, []);

  const onSwitchLogin = useCallback(() => {
    setIsRegister(!isRegister);
  }, [isRegister]);

  const onActiveTabChange = useCallback(
    (tab: number) => {
      const tabIndex = tabSelected.findIndex((item) => item === tab);
      if (tabIndex === -1) setTabSelected([...tabSelected, tab]);
    },
    [tabSelected],
  );

  const HomeAuth = isRegister ? AuthRegister : AuthLogin;

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col gap-4">
        <Button onClick={onOpenLogin}>Đăng Nhập</Button>
        <Modal show={isShowLogin} dismissible onClose={() => setIsShowLogin(false)}>
          <Modal.Header>{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</Modal.Header>
          <Modal.Body>
            <HomeAuth onCancel={() => setIsShowLogin(false)} onSwitch={onSwitchLogin} />
          </Modal.Body>
        </Modal>
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
