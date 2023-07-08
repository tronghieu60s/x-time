import HomeFeature from "@/features/Home";
import Head from "next/head";

export default function IndexPage() {
  return (
    <div>
      <Head>
        <title>MemReFinder</title>
      </Head>
      <HomeFeature />
    </div>
  );
}
