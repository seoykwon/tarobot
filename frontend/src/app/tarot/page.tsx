// import { TarotGame } from "@/components/TarotGame";

// interface TarotBot {
//   id: string;
//   name: string;
//   description: string;
//   mbti: string;
// }

// async function fetchTarotBots(): Promise<TarotBot[]> {
//   try {
//     const response = await fetch("http://localhost:8080/api/v1/tarot-bots", {
//       cache: "no-store", // 최신 데이터를 가져오기 위해 캐싱 비활성화
//     });

//     if (!response.ok) {
//       console.error("Failed to fetch tarot bots");
//       return [];
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching tarot bots:", error);
//     return []; // 에러 발생 시 빈 배열 반환
//   }
// }

// export default async function TarotBotsPage() {
//   const bots = await fetchTarotBots(); // API에서 타로봇 목록 가져오기

//   return (
//     <main className="min-h-screen pb-16">
//       <div className="p-4">
//         <h1 className="font-page-title">Master List</h1>
//         {bots.length > 0 ? (
//           <div className="grid gap-4">
//             {bots.map((bot) => (
//               <TarotGame
//                 key={bot.id}
//                 id={bot.id}
//                 name={bot.name}
//                 description={bot.description}
//                 mbti={bot.mbti}
//                 imageSrc="/target.svg"
//                 linkPrefix="/tarot/bots"
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-muted-foreground">이용 가능한 타로봇이 없습니다.</p> // 데이터 없을 때 메시지 표시
//         )}
//       </div>
//     </main>
//   );
// }
import { TarotGame } from "@/components/TarotGame";

interface TarotBot {
  // id: string;
  id: number;
  name: string;
  description: string;
  mbti: string;
}

// ✅ 더미 데이터 (API가 실패하면 이 데이터를 사용)
const dummyBots: TarotBot[] = [
  {
    id: 1,
    name: "Mystic Sage",
    description: "An ancient tarot master who sees the unseen.",
    mbti: "INFJ",
  },
  {
    id: 2,
    name: "Oracle of Stars",
    description: "A cosmic seer who reads the fate through the constellations.",
    mbti: "ENFP",
  },
  {
    id: 3,
    name: "Shadow Seer",
    description: "A mysterious fortune teller who uncovers hidden truths.",
    mbti: "INTP",
  },
];

async function fetchTarotBots(): Promise<TarotBot[]> {
  try {
    const response = await fetch("http://localhost:8080/api/v1/tarot-bots", {
      cache: "no-store", // 최신 데이터를 가져오기 위해 캐싱 비활성화
    });

    if (!response.ok) {
      console.error("Failed to fetch tarot bots, using dummy data.");
      return dummyBots; // ✅ API 실패 시 더미 데이터 반환
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tarot bots:", error);
    return dummyBots; // ✅ 네트워크 에러 발생 시 더미 데이터 반환
  }
}

export default async function TarotBotsPage() {
  const bots = await fetchTarotBots(); // API에서 타로봇 목록 가져오기

  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        <h1 className="font-page-title">Master List</h1>
        {bots.length > 0 ? (
          <div className="grid gap-4">
            {bots.map((bot) => (
              <TarotGame
                key={bot.id}
                id={bot.id}
                name={bot.name}
                description={bot.description}
                mbti={bot.mbti}
                imageSrc="/target.svg"
                linkPrefix="/tarot/bots"
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">이용 가능한 타로봇이 없습니다.</p> 
        )}
      </div>
    </main>
  );
}
