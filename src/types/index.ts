export interface FolderItemInterface {
  id: string;
  parentId?: string;
  name: string;
  description?: string;
  type: "project" | "scenario" | "device" | "property";
  children?: FolderItemInterface[];
  isExpanded?: boolean; // 펼침 상태 관리용
  unit?: string;
}
