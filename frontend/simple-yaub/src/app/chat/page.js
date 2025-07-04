import Chat from "@/components/Chat";

import '../../styles/global.css';
import '../../styles/nav-bar.scss';
import '../../styles/footer.scss';
import '../page.scss';
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  return (
      <Chat session={session} />
  );
} 