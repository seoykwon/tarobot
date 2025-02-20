// utils/botNameMap.ts
export const botNameMap: Record<string, string> = {
    "0": "진이",
    "1": "범달",
    "2": "3번",
    "3": "4번",
    "4": "5번",
  };
  
  export const getBotName = (botId: string | null): string => {
    if (!botId) return "모두";
    return botNameMap[botId] || "모두";
  };
  