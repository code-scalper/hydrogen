export interface ProjectInterface {
	id: string;
	parentId?: string;
	name: string;
	description?: string;

	type: "project";
	children?: ScenarioInterface[] | undefined;
	isExpanded?: boolean;
	src?: string;
}

export interface InputPoint {
	id: string;
	x: number; // 0 ~ 1
	y: number;
	value?: string;
	status: "normal" | "warning" | "error";
}
export interface ScenarioInterface {
	id: string;
	parentId?: string;
	name: string;
	description?: string;
	type: "scenario";
	sfcName: string;
	src: string;
	isExpanded?: boolean;
	// inputPoints: InputPoint[];
	children: DeviceInterface[] | undefined;
	baseData?: BaseDataProps[];
}
export type DeviceProperty = {
	key: string;
	name: string;
	unit: string;
	value?: string;
	description: string;
	displayOnDiagram?: boolean;
	status?: string;
	x?: number;
	y?: number;
	order: number;
	io?: string;
	type: string;
	options?: { id: string; name: string }[];
};

export type DevicePropertyMap = {
	[deviceId: string]: DeviceProperty[];
};

export interface DeviceBaseInterface {
	id: string;
	name: string;
	engName?: string;
	type: "device" | "module";
	src?: string;
	projectId?: string;
	scenarioId?: string;
	unit?: string;
	props: DeviceProperty[];
	outputProps?: DeviceProperty[];
	size: number;
	key?: string;
	description?: string;
	io?: string;

	displayOnDiagram?: boolean;
	/** ⬇️ 새로 추가된 좌표 정보 */
	x: number; // 0 ~ 1, 이미지 기준 상대 좌표
	y: number;
	order: number;
}

export interface DeviceInterface extends DeviceBaseInterface {
	//
	children?: DeviceInterface[];
}

export interface BaseDataProps {
	id: string;
	key: string;
	name: string;
	altName?: string;
	unit: string;
	value: string;
	type: string;
	options?: ReadonlyArray<{ id: string; name: string }>;
	description: string;
	placeholder?: string;
}
