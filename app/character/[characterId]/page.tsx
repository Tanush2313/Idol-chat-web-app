import { CharacterDetailPage } from "@/components/character/character-detail-page"

export default function CharacterPage({ params }: { params: { characterId: string } }) {
  return <CharacterDetailPage characterId={params.characterId} />
}
