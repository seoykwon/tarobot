export default function TarotBotPage({ params }: { params: { id: string } }) {
    return (
      <div className="min-h-screen p-4">
        <h1 className="text-2xl font-bold">Tarot Bot Details</h1>
        <p>현재 선택된 타로 상담사 ID: {params.id}</p>
      </div>
    );
  }
  