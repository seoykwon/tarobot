interface StepOneProps {
    onSelect: (choice: number) => void;
  }
  
  export default function StepOne({ onSelect }: StepOneProps) {
    return (
      <div>
        <button onClick={() => onSelect(1)}>연애운</button>
        <button onClick={() => onSelect(2)}>금전운</button>
        <button onClick={() => onSelect(3)}>취업운</button>
      </div>
    );
  }
  