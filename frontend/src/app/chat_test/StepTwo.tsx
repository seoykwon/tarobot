import { useState } from 'react';

interface StepTwoProps {
  onCardSelect: (cards: string[]) => void;
}

export default function StepTwo({ onCardSelect }: StepTwoProps) {
  const cards = ["Card1", "Card2", "Card3", "Card4"];
  const [selected, setSelected] = useState<string[]>([]);

  function toggleCard(card: string) {
    setSelected((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  }

  return (
    <div>
      {cards.map((card) => (
        <button
          key={card}
          onClick={() => toggleCard(card)}
          style={{
            backgroundColor: selected.includes(card) ? 'green' : 'white',
          }}
        >
          {card}
        </button>
      ))}
      <button onClick={() => onCardSelect(selected)}>선택 완료</button>
    </div>
  );
}
