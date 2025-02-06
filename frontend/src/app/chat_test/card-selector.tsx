"use client";

import type React from "react";
import styles from "./CardSelector.module.css";

interface CardSelectorProps {
  onCardSelect: (cardId: string) => void;
  onClose: () => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onClose }) => {
  // 메이저 카드: "maj0" ~ "maj21"
  const majorCards: string[] = Array.from({ length: 22 }, (_, i) => `maj${i}`);

  // 마이너 카드: cups, pents, swords, wands 각 1~14
  const minorCards: string[] = [];
  const suits = ["cups", "pents", "swords", "wands"];
  suits.forEach((suit) => {
    for (let i = 1; i <= 14; i++) {
      minorCards.push(`${suit}${i}`);
    }
  });

  // 전체 카드 배열 (총 78장)
  const allCards: string[] = [...majorCards, ...minorCards];

  // 사용자가 카드 그리드를 클릭하면 전체 78장 중 랜덤으로 하나 선택
  const handleRandomCardSelect = () => {
    const randomIndex = Math.floor(Math.random() * allCards.length); // 0부터 77 사이의 랜덤 인덱스
    const selectedCard = allCards[randomIndex];
    onCardSelect(selectedCard);
  };

  // 화면에는 18장만 (가로 6장씩 3줄) 미리보기 용도로 표시
  const displayedCards = allCards.slice(0, 18);

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.cardGrid}>
          {displayedCards.map((cardId) => (
            <div
              key={cardId}
              className={styles.card}
              onClick={handleRandomCardSelect}
            >
              <div
                className={styles.cardBack}
                style={{
                  backgroundImage: "url('/card-back-celestial.svg')",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSelector;
