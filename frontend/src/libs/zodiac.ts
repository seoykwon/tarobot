// 별자리 데이터 (x, y 좌표는 0-100 사이의 값으로 가정)
export const zodiacData = {
    Aries: {
      name: "양자리",
      points: [
        [20, 20],
        [25, 25],
        [30, 20],
        [35, 25],
        [40, 20],
      ],
    },
    Taurus: {
      name: "황소자리",
      points: [
        [25, 30],
        [30, 35],
        [35, 30],
        [40, 35],
        [45, 30],
      ],
    },
    Gemini: {
      name: "쌍둥이자리",
      points: [
        [50, 20],
        [55, 25],
        [60, 20],
        [65, 25],
        [70, 20],
      ],
    },
    Cancer: {
      name: "게자리",
      points: [
        [75, 30],
        [80, 35],
        [85, 30],
        [90, 35],
        [95, 30],
      ],
    },
    Leo: {
      name: "사자자리",
      points: [
        [20, 50],
        [25, 55],
        [30, 50],
        [35, 55],
        [40, 50],
      ],
    },
    Virgo: {
      name: "처녀자리",
      points: [
        [45, 60],
        [50, 65],
        [55, 60],
        [60, 65],
        [65, 60],
      ],
    },
    Libra: {
      name: "천칭자리",
      points: [
        [70, 50],
        [75, 55],
        [80, 50],
        [85, 55],
        [90, 50],
      ],
    },
    Scorpio: {
      name: "전갈자리",
      points: [
        [25, 70],
        [30, 75],
        [35, 70],
        [40, 75],
        [45, 70],
      ],
    },
    Sagittarius: {
      name: "궁수자리",
      points: [
        [50, 80],
        [55, 85],
        [60, 80],
        [65, 85],
        [70, 80],
      ],
    },
    Capricorn: {
      name: "염소자리",
      points: [
        [75, 70],
        [80, 75],
        [85, 70],
        [90, 75],
        [95, 70],
      ],
    },
    Aquarius: {
      name: "물병자리",
      points: [
        [20, 90],
        [25, 95],
        [30, 90],
        [35, 95],
        [40, 90],
      ],
    },
    Pisces: {
      name: "물고기자리",
      points: [
        [45, 80],
        [50, 85],
        [55, 80],
        [60, 85],
        [65, 80],
      ],
    },
  }
  
  export function getZodiacSign(birthdate: string): keyof typeof zodiacData | null {
    const date = new Date(birthdate)
    const month = date.getMonth() + 1
    const day = date.getDate()
  
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries"
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus"
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini"
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer"
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo"
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo"
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra"
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio"
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius"
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn"
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius"
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces"
  
    return null
  }
  
  