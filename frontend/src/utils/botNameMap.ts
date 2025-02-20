// utils/botNameMap.ts
export const botNameMap: Record<string, string> = {
    "1": "진이",
    "2": "범달",
    "3": "3번",
    "4": "4번",
    "5": "5번",
  };
  
  export const getBotName = (botId: string | null): string => {
    if (!botId) return "모두";
    return botNameMap[botId] || "모두";
  };
  