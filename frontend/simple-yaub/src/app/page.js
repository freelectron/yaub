import MainPage from "@/components/MainPage";
import {fetchPostsMetaInfo} from "@/components/PublicFiles";

import '../styles/global.css';
import './page.css';

export default async function Home() {
  const initialPostsMetaInfo = await fetchPostsMetaInfo();

  return (
      <MainPage defaultPostsMetaInfo={initialPostsMetaInfo} />
  );
}
