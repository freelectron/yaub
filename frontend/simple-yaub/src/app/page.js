import MainPage from "@/components/MainPage";
import {fetchPostsMetaInfo} from "@/components/Backend";

export default async function Home() {
  const initialPostsMetaInfo = await fetchPostsMetaInfo();

  console.log(initialPostsMetaInfo);
  // Ensure the data has the correct structure
  const safeData = {
    posts: Array.isArray(initialPostsMetaInfo?.posts)
        ? initialPostsMetaInfo.posts
        : []
  };

  return (
      <MainPage defaultPostsMetaInfo={safeData} />
  );
}
