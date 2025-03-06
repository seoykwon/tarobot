// utils/botNameMap.ts
export const botNameMap: Record<string, string> = {
    "1": "온달",
    "2": "나비",
    "3": "루미",
    "4": "라쿠",
    "5": "벨로",
  };
  
  export const getBotName = (botId: string | null): string => {
    if (!botId) return "모두";
    return botNameMap[botId] || "모두";
  };
  