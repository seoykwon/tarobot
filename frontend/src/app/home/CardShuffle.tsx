'use client';

import React, { useState } from 'react';
import styles from './CardSelector.module.css';
import Image from 'next/image';

const CardSelector: React.FC = () => {
  const [isCardGridVisible, setIsCardGridVisible] = useState(false);
  const [isSelectedCardVisible, setIsSelectedCardVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [tarotNumber, setTarotNumber] = useState<number | null>(null);

  const handleOpenCardGrid = () => {
    setIsCardGridVisible(true);
    setSelectedCard(null);
    setTarotNumber(null);
  };

  const handleCloseCardGrid = () => {
    setIsCardGridVisible(false);
    setSelectedCard(null);
    setTarotNumber(null);
  };

  const handleCloseSelectedCard = () => {
    setIsSelectedCardVisible(false);
    setSelectedCard(null);
    setTarotNumber(null);
  };

  const handleCardSelect = (index: number) => {
    if (selectedCard !== null) return;
    const randomNumber = Math.floor(Math.random() * 22);
    setSelectedCard(index);
    setTarotNumber(randomNumber);
    setIsCardGridVisible(false);
    setIsSelectedCardVisible(true);
  };

  return (
    <div>
      <button 
        className={styles.openButton} 
        onClick={handleOpenCardGrid}
      >
        타로 카드 선택하기
      </button>

      {isCardGridVisible && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseCardGrid}
            >
              ✕
            </button>
            <div className={styles.cardGrid}>
              {Array.from({ length: 18 }, (_, index) => (
                <div
                  key={index}
                  className={styles.card}
                  onClick={() => handleCardSelect(index)}
                >
                  <div 
                    className={styles.cardBack}
                    style={{
                      backgroundImage: `url('/card-back-celestial.svg')`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isSelectedCardVisible && tarotNumber !== null && (
        <div className={styles.overlay}>
          <div className={styles.selectedCardOverlay}>
            <button 
              className={styles.closeButton} 
              onClick={handleCloseSelectedCard}
            >
              ✕
            </button>
            <div className={styles.selectedCard}>
            <Image
              src={`/basic/maj${tarotNumber}.svg`}
              alt={`Tarot card ${tarotNumber}`}
              className={styles.selectedCardImage}
              width={240} // 이미지의 고정 너비 (적절히 설정)
              height={360} // 이미지의 고정 높이 (적절히 설정)
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSelector;
