import { RoomChatPage } from "@/components/rooms/room-chat-page"

export default async function RoomChat({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  return <RoomChatPage roomId={roomId} />
}
