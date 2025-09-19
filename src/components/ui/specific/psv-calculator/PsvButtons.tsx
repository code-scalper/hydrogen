interface PsvButtonsInterface {
  setPsvOpen: (arg0: boolean) => void;
  setChartOpen: (arg0: boolean) => void;
}

const PsvButtons = ({ setPsvOpen, setChartOpen }: PsvButtonsInterface) => {
  return (
    <div className="flex justify-center gap-2 px-4 py-3 border-t border-stone-700">
      <button
        onClick={() => setPsvOpen(false)}
        className="text-xs px-6 py-2 bg-gray-500 text-gray-200 hover:bg-gray-600"
      >
        닫기
      </button>
      <button
        onClick={() => setPsvOpen(false)}
        className="text-xs px-6 py-2 bg-blue-700 text-gray-200 hover:bg-gray-600"
      >
        계산
      </button>
      <button
        onClick={() => setChartOpen(true)}
        className="text-xs px-6 py-2 bg-blue-700 text-gray-200 hover:bg-gray-600"
      >
        그래프 출력
      </button>
      <button
        onClick={() => setPsvOpen(false)}
        className="text-xs px-6 py-2 bg-blue-700 text-gray-200 hover:bg-gray-600"
      >
        저장
      </button>
    </div>
  );
};

export default PsvButtons;
