import MainPage from "@/components/MainPage";
import {fetchPostsMetaInfo} from "@/components/Backend";

import '../styles/global.css';
import '../styles/styles.css';

export default async function Home() {
  const initialPostsMetaInfo = await fetchPostsMetaInfo();

  return (
      <MainPage defaultPostsMetaInfo={initialPostsMetaInfo} />
  );
}
