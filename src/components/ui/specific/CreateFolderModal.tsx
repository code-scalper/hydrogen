import { useState } from "react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreateFolderModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateFolderModalProps) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-md w-96 shadow-lg border border-gray-800 border-r">
        {/* Header */}
        <div className="flex justify-between items-center  p-2 bg-gray-900">
          <h2 className="text-sm text-slate-200  font-semibold">
            프로젝트 생성
          </h2>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-black text-sm"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex items-center flex-start gap-2">
          <label className="text-sm text-slate-200 mr-3">프로젝트 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-white text-sm border-none bg-gray-700 border rounded p-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-800 flex-1"
            placeholder="예: New Project"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // 엔터를 눌렀을 때 실행할 코드
                onCreate(name); // 예: 폴더 생성
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-500 text-gray-200 hover:bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={() => {
              onCreate(name);
              setName("");
              onClose();
            }}
            className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};
