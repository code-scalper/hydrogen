interface WhatIfProps {
  showModal: boolean;
  setShowModal: (arg0: boolean) => void;
  handleEvent: (arg0: string) => void;
}

export const WhatIf = ({
  showModal,
  setShowModal,
  handleEvent,
}: WhatIfProps) => {
  if (!showModal) return null;

  const fields = [
    { label: "CHSS 입력용기의 개별 수소저장 부피", unit: "m³" },
    { label: "CHSS 전체 수소 저장 부피", unit: "m³" },
    { label: "디스펜서의 수소 충전 압력 입력", unit: "MPa" },
    { label: "CHSS의 목표 SOC(충전율)", unit: "%" },
    { label: "CHSS로 공급하는 수소의 질량유량", unit: "g/s" },
    { label: "대기온도", unit: "°C" },
    { label: "CHSS로 공급하는 수소의 온도", unit: "°C" },
    { label: "CHSS 내 초기 수소저장 입력", unit: "MPa" },
    {
      label: "충전 프로토콜 선택",
      options: [
        { key: "LT", label: "LT" },
        { key: "MCFORMULA", label: "MC Formula" },
        { key: "RTRHFP", label: "LT" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-stone-600 bg-opacity-40 flex items-center justify-center z-[999] text-xs text-slate-200">
      <div className="bg-gray-800 w-[700px] shadow-lg border border-stone-600 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 bg-gray-900">
          <h2 className="text-sm text-slate-200 font-semibold">What-if 팝업</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-slate-300 hover:text-white text-xs"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 space-y-6">
          {/* 장치 선택 */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label>장치</label>
            <select className="bg-gray-700 border border-gray-600 px-2 py-1 text-slate-200">
              <option>-</option>
              <option>장치 1</option>
              <option>장치 2</option>
            </select>
          </div>

          {/* 변수 입력 그리드 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {fields.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_100px_40px] items-center gap-2"
              >
                <label className="truncate">{f.label}</label>
                {f.options ? (
                  <select className="bg-gray-700 border border-gray-600 px-2 py-1 text-slate-200">
                    {f.options.map((opt, index) => (
                      <option value={opt.key} key={index}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    {" "}
                    <input
                      type="text"
                      className="bg-gray-700 border border-gray-600 px-2 py-1 text-right w-full"
                      placeholder="-"
                    />
                    <span>{f.unit}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 px-4 py-3 border-t border-stone-700 bg-gray-900">
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-xs text-white"
            onClick={() => handleEvent("whatif")}
          >
            시작
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-xs text-white"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
