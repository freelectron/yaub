import Chat from '@/components/Chat';
import '../../styles/global.css';
import '../../styles/nav-bar.scss';
import '../../styles/footer.scss';
import '../page.scss';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Session } from 'next-auth';

export default async function ChatPage() {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <Chat session={session} />
  );
}
