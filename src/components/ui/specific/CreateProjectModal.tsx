import { TextArea } from "@radix-ui/themes";
import { useEffect, useState } from "react";

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (name: string, description: string) => void;
	title?: string;
	submitLabel?: string;
	initialName?: string;
	initialDescription?: string;
}

export const CreateProjectModal = ({
	isOpen,
	onClose,
	onSubmit,
	title = "프로젝트 생성",
	submitLabel = "생성",
	initialName = "",
	initialDescription = "",
}: CreateProjectModalProps) => {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState(initialDescription);
	const nameInputId = "create-project-name";
	const descriptionInputId = "create-project-description";

	useEffect(() => {
		if (isOpen) {
			setName(initialName);
			setDescription(initialDescription);
		}
	}, [isOpen, initialName, initialDescription]);

	const handleSubmit = () => {
		if (!name.trim()) {
			return;
		}
		onSubmit(name.trim(), description.trim());
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-gray-800 rounded-md w-96 shadow-lg border border-gray-800 border-r">
				{/* Header */}
				<div className="flex justify-between items-center  p-2 bg-gray-900">
					<h2 className="text-sm text-slate-200  font-semibold">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-300 hover:text-black text-sm"
					>
						×
					</button>
				</div>

				{/* Content */}
				<div className="p-4 space-y-2">
					<div className=" flex items-center flex-start gap-2">
						<label
							htmlFor={nameInputId}
							className="text-xs text-slate-200 mr-3"
						>
							프로젝트 이름
						</label>
						<input
							id={nameInputId}
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="text-white text-xs border-none bg-gray-700 border rounded p-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-800 flex-1"
							placeholder="예: New Project"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSubmit();
								}
							}}
						/>
					</div>

					<div className="flex items-start flex-start gap-2">
						<label
							htmlFor={descriptionInputId}
							className="text-xs text-slate-200 mr-3"
						>
							프로젝트 설명
						</label>
					<TextArea
						id={descriptionInputId}
						placeholder=""
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						size="1" // 1 = small, 2 = default, 3 = large
						className="!border-none !border rounded p-1 px-2 
						placeholder-gray-400
						!focus:outline-none !focus:ring-2 !focus:ring-blue-800 flex-1 !bg-gray-700 !text-white"
							onKeyDown={(e) => {
								if (e.key === "Enter" && e.metaKey) {
									handleSubmit();
								}
							}}
						/>
						{/* <input
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
            /> */}
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 px-4 py-3">
					<button
						type="button"
						onClick={onClose}
						className="text-xs px-4 py-1  bg-gray-500 text-gray-200 hover:bg-gray-600"
					>
						취소
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!name.trim()}
						className="text-xs px-4 py-1  bg-blue-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitLabel}
					</button>
				</div>
			</div>
		</div>
	);
};
