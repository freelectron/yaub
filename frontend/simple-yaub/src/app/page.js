import MainPage from "@/components/MainPage";
import {fetchPostsMetaInfo} from "@/components/Backend";

export default async function Home() {
  const initialPostsMetaInfo = await fetchPostsMetaInfo();

  return (
      <MainPage defaultPostsMetaInfo={initialPostsMetaInfo} />
  );
}
