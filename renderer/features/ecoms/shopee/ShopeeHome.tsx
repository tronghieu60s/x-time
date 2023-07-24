import { User } from 'firebase/auth';
import { Button, Modal, Tabs } from 'flowbite-react';
import { useCallback, useState } from 'react';
import { Settings } from 'react-feather';
import ShopeeDetect from './ShopeeDetect';
import ShopeePromotion from './ShopeePromotion';
import ShopeeSetting from './ShopeeSetting';

type Props = {
  user: User | null;
};

const apiTestLogin = '/api/ecoms/shopee/auth/test-login';

export default function ShopeeHome(props: Props) {
  const { user } = props;
  const [isLogged, setIsLogged] = useState(false);
  const [clickedLogin, setClickedLogin] = useState(false);

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
          <Button onClick={onTestLogin} outline={clickedLogin}>
            {clickedLogin ? (isLogged ? 'Logged' : 'Not Logged') : 'Test Login'}
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
          {user ? <ShopeeDetect /> : <div>Please login to use this feature.</div>}
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
