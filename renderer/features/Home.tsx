import { Modal, Button, Tabs } from 'flowbite-react';
import ShopeeHome from './ecoms/shopee/ShopeeHome';
import AuthLogin from './auth/AuthLogin';
import { useEffect, useState } from 'react';

export default function HomeFeature() {
  const [isShowLogin, setIsShowLogin] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every second!');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="flex flex-col gap-4">
        <div>
          <Button onClick={() => setIsShowLogin(true)}>
            Login
          </Button>
          <Modal show={isShowLogin} dismissible={true} onClose={() => setIsShowLogin(false)}>
            <Modal.Header>Login</Modal.Header>
            <Modal.Body>
              <AuthLogin onCancel={() => setIsShowLogin(false)} />
            </Modal.Body>
          </Modal>
        </div>
        <Tabs.Group aria-label="Default tabs" style="default">
          <Tabs.Item active title="Shopee">
            <ShopeeHome />
          </Tabs.Item>
          <Tabs.Item active title="Lazada">
            <ShopeeHome />
          </Tabs.Item>
          <Tabs.Item active title="Hasaki" disabled>
            <ShopeeHome />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
}
