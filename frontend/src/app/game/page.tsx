// import { TarotGame } from "@/components/TarotGame";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/Card";
// import { ChevronRight, GamepadIcon } from "lucide-react";
// import CardSelector from "../home/CardShuffle";
// interface Game {
//   minigameId: number;
//   name: string;
//   description: string;
// }

// async function fetchGames(): Promise<Game[]> {
//   try {
//     const response = await fetch("http://localhost:8080/minigames", { cache: "no-store" }); // SSR에서 최신 데이터 가져오기
//     if (!response.ok) {
//       throw new Error("Failed to fetch mini-games");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching mini-games:", error);
//     return []; // 에러 발생 시 빈 배열 반환
//   }
// }

// export default async function GamePage() {
//   const games = await fetchGames(); // API에서 미니게임 목록 가져오기

//   return (
//     <main className="min-h-screen pb-16">
//       <div className="p-4">
//         <h1 className="font-page-title mb-4">미니게임 목록</h1>
//         {games.length > 0 ? (
//           <div className="grid gap-4">
//             {games.map((game) => (
//               <TarotGame
//                 key={game.minigameId}
//                 id={game.minigameId.toString()}
//                 name={game.name}
//                 description={game.description}
//                 imageSrc={`/games/${game.minigameId}.svg`} // 이미지 경로
//                 linkPrefix="/game" // 게임 상세 페이지 링크
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-muted-foreground">사용 가능한 미니게임이 없습니다.</p>
//         )}
//       </div>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";

type MemoryCard = {
  id: number;
  image: string; // 이미지 경로
  isMatched: boolean;
};

const createCards = () => {
  const imagePaths = [
    "/basic/maj0.svg",
    "/basic/maj1.svg",
    "/basic/maj2.svg",
    "/basic/maj3.svg",
    "/basic/maj4.svg",
    "/basic/maj5.svg",
  ];

  const cards: MemoryCard[] = [];

  imagePaths.forEach((image, index) => {
    cards.push(
      { id: index * 2, image, isMatched: false },
      { id: index * 2 + 1, image, isMatched: false }
    );
  });

  return cards.sort(() => Math.random() - 0.5);
};

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>(createCards());
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const handleCardClick = (clickedIndex: number) => {
    if (isChecking || cards[clickedIndex].isMatched) return;
    if (flippedIndexes.includes(clickedIndex)) return;
    if (flippedIndexes.length === 2) return;

    const newFlipped = [...flippedIndexes, clickedIndex];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.image === secondCard.image) {
        setTimeout(() => {
          setCards(
            cards.map((card, index) =>
              index === firstIndex || index === secondIndex
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedIndexes([]);
          setMatches((m) => m + 1);
          setIsChecking(false);

          if (matches === cards.length / 2 - 1) {
            toast("🎉 Congratulations! You've found all the matches! 🎈", {
              className: "bg-purple-900 text-purple-100 border-purple-700",
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedIndexes([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createCards());
    setFlippedIndexes([]);
    setMatches(0);
    setIsChecking(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-20 space-y-8 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
      <div className="text-center space-y-4">
        <p className="text-indigo-200">
          카드 짝 찾은 개수: {matches} of {cards.length / 2}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6 p-6 rounded-xl bg-indigo-950/50 backdrop-blur-sm">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ rotateY: 0 }}
            animate={{
              rotateY:
                card.isMatched || flippedIndexes.includes(index) ? 180 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="perspective-1000"
          >
            <Card
              className={`relative w-24 h-24 md:w-32 md:h-32 cursor-pointer transform-style-3d transition-all duration-300 ${
                card.isMatched
                  ? "bg-indigo-900/50 border-indigo-400/50"
                  : flippedIndexes.includes(index)
                  ? "bg-indigo-800/50 border-indigo-500/50"
                  : "bg-indigo-950 border-indigo-800 hover:border-indigo-600 hover:bg-indigo-900/80"
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/5" />
              
              {/* 카드 앞면 */}
              <AnimatePresence>
                {(card.isMatched || flippedIndexes.includes(index)) && (
                  <motion.div
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ opacity: 1, rotateY: 180 }}
                    exit={{ opacity: 0, rotateY: 180 }}
                    className="absolute inset-0 flex items-center justify-center backface-hidden"
                  >
                    <img
                      src={card.image}
                      alt={`Card ${index}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 카드 뒷면 */}
              {!(card.isMatched || flippedIndexes.includes(index)) && (
                <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                  <img
                    src="/card-back-celestial.svg" // 여기에 카드 뒷면 이미지 경로를 추가
                    alt="Card Back"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={resetGame}
        variant="outline"
        size="lg"
        className="bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
      >
        새 게임 시작하기
      </Button>
    </div>
  );
}


