import HomeFeature from '@/features/Home';
import Head from 'next/head';

export default function IndexPage() {
  return (
    <div>
      <Head>
        <title>Shopee Test</title>
      </Head>
      <HomeFeature />
    </div>
  );
}
