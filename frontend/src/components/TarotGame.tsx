import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/Card"

interface TarotGameProps {
  id: number
  name: string
  description: string
  mbti?: string
  concept?: string
  imageSrc: string
  linkPrefix: string
}

export function TarotGame({ id, name, description, mbti, concept, imageSrc, linkPrefix }: TarotGameProps) {
  return (
    <Link href={`${linkPrefix}/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex gap-4 p-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={imageSrc || "/placeholder.svg"} alt={name} width={96} height={96} />
          </div>
          <CardContent className="p-0 flex-1">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            {concept && <p className="text-sm text-muted-foreground">{concept}</p>}
            {mbti && <p className="text-sm text-muted-foreground">{mbti}</p>}
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

