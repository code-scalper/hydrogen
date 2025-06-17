export interface ProjectInterface {
  id: string;
  parentId?: string;
  name: string;
  description?: string;
  type: "project" | "scenario" | "device" | "property";
  children?: ProjectInterface[];
  isExpanded?: boolean; // 펼침 상태 관리용

  src?: string;
  inputPoints?: InputPoint[];
}

export interface InputPoint {
  id: string;
  x: number; // 0 ~ 1
  y: number;
  value: string;
  label: string;
}

export interface ScenarioInterface extends ProjectInterface {
  children: DeviceInterface[];
  src: string;
  inputPoints: {
    id: string;
    x: number;
    y: number;
    value: string;
    label: string;
    status: "normal" | "warning" | "error";
  }[];
}
export type DeviceProperty = {
  key: string;
  name: string;
  unit: string;
  value?: string;
};

export type DevicePropertyMap = {
  [deviceId: string]: DeviceProperty[];
};
export interface DeviceInterface {
  id: string;
  name: string;
  type: "device";
  src: string;
  projectId: string;
  scenarioId: string;
  unit?: string;
  props: DeviceProperty[]; // ✅ 배열로 정의
}
