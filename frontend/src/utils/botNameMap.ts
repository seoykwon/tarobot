// utils/botNameMap.ts
export const botNameMap: Record<string, string> = {
    "1": "온달",
    "2": "나비",
  };
  
  export const getBotName = (botId: string | null): string => {
    if (!botId) return "미루";
    return botNameMap[botId] || "미루";
  };
  