import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/Card"
import { ChevronRight, GamepadIcon } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle';


export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Header */}
      <header className="p-4 text-center border-b">
        <h1 className="font-login-title">MysticPixel</h1>
      </header>
      <ThemeToggle />

      <div className="p-4 space-y-6">
        {/* Today's Fortune */}
        <section>
          <h2 className="font-tarobot-title font-size-18">Today's Fortune</h2>
          <Link href="/tarot/daily">
            <Card className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-16 h-24 flex-shrink-0">
                    <GamepadIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Daily Mysteries Ep.</h3>
                    <p className="text-sm text-muted-foreground">
                      "Today is a great day to start something new. Trust your intuition."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Tarot Masters */}
        <section>
          <Link href="/tarot">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-mono">Tarot masters</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <div className="space-y-2">
            {[
              { name: "Luna", title: "Magical Melodies" },
              { name: "Aurora", title: "Harmony's Call" },
              { name: "Whispers of Fate", title: "Eternal Bonds" }
            ].map((master, index) => (
              <Link key={index} href={`/tarot/bots/${index + 1}`}>
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <GamepadIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-tarobot-title">{master.name}</h3>
                        <p className="font-tarobot-subtitle">{master.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Mini-Games */}
        <section>
          <Link href="/game">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-mono">Mini-Games</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          <Link href="/games/puzzle">
            <Card className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <GamepadIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enchanted Puzzle</h3>
                    <p className="text-sm text-muted-foreground">Solve the mystery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </main>
  )
}