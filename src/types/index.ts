export interface FolderItemInterface {
  id: string;
  name: string;
  type?: "folder" | "file";
  children?: FolderItemInterface[];
  isExpanded?: boolean; // 펼침 상태 관리용
}
