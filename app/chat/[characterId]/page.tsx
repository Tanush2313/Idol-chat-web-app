import { ChatPage } from "@/components/chat/chat-page"

export default async function Chat({ params }: { params: Promise<{ characterId: string }> }) {
  const { characterId } = await params
  return <ChatPage characterId={characterId} />
}
