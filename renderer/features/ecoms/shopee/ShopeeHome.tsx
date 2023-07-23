import { Button, Modal, Tabs } from 'flowbite-react';
import ShopeeDetect from './ShopeeDetect';
import { Settings } from 'react-feather';
import { useCallback, useState } from 'react';
import ShopeeSetting from './ShopeeSetting';
import ShopeePromotion from './ShopeePromotion';
import AuthLogin from '@/features/auth/AuthLogin';

const apiTestLogin = '/api/ecoms/shopee/auth/test-login';

export default function ShopeeHome() {
  const [isLogged, setIsLogged] = useState(false);
  const [clickedLogin, setClickedLogin] = useState(false);

  const [isShowLogin, setIsShowLogin] = useState(false);
  const [isShowSetting, setIsShowSetting] = useState(false);

  const onTestLogin = useCallback(() => {
    fetch(apiTestLogin, { method: 'POST' })
      .then((res) => res.json())
      .then((res) => {
        const { logged = false } = res;
        setIsLogged(logged);
        setClickedLogin(true);
      });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div>
            <Button onClick={() => setIsShowLogin(true)}>Login</Button>
            <Modal show={isShowLogin} dismissible={true} onClose={() => setIsShowLogin(false)}>
              <Modal.Header>Login</Modal.Header>
              <Modal.Body>
                <AuthLogin onCancel={() => setIsShowLogin(false)} />
              </Modal.Body>
            </Modal>
          </div>
          <Button onClick={onTestLogin} outline={clickedLogin}>
            Shopee ({clickedLogin ? (isLogged ? 'Logged' : 'Not Logged') : 'Test Login'})
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsShowSetting(true)}>
            <Settings size={20} />
          </Button>
        </div>
      </div>
      <Tabs.Group aria-label="Default tabs" style="default">
        <Tabs.Item active title="Shopee Detect">
          <ShopeeDetect />
        </Tabs.Item>
        <Tabs.Item title="Shopee Promotion">
          <ShopeePromotion />
        </Tabs.Item>
      </Tabs.Group>
      <Modal show={isShowSetting} dismissible onClose={() => setIsShowSetting(false)}>
        <Modal.Header>Settings</Modal.Header>
        <Modal.Body>
          <ShopeeSetting onClose={() => setIsShowSetting(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

