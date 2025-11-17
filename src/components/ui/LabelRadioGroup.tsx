import * as HoverCard from "@radix-ui/react-hover-card";
import { Avatar, Box, Flex, Heading, Text } from "@radix-ui/themes";

type Option = {
	id: string;
	name: string;
};

interface LabelRadioGroupProps {
	label: string;
	name: string;
	unit?: string;
	description?: string;
	options: Option[];
	value: string;
	onChange: (key: string, value: string) => void;
}

const LabelRadioGroup = ({
	label,
	unit = "",
	description = "",
	name,
	options,
	value,
	onChange,
}: LabelRadioGroupProps) => {
	const groupName = `label-radio-${name}`;

	return (
		<div className="flex items-start gap-2">
			<HoverCard.Root>
				<HoverCard.Trigger asChild>
					<span className="text-xs text-slate-200 mr-3 w-4/5 cursor-pointer flex items-center gap-1">
						{label}
					</span>
				</HoverCard.Trigger>
				<HoverCard.Content className="max-w-[300px] bg-white text-gray-900 border border-gray-200 rounded p-2">
					<Flex gap="4">
						<Avatar
							size="3"
							fallback="R"
							radius="full"
							src="https://pbs.twimg.com/profile_images/1337055608613253126/r_eiMp2H_400x400.png"
						/>
						<Box>
							<Heading size="3" as="h3">
								{label}
							</Heading>
							<Text as="div" size="2" color="gray" mb="2">
								단위: {unit}
							</Text>
							<Text as="div" size="2">
								{description}
							</Text>
						</Box>
					</Flex>
				</HoverCard.Content>
			</HoverCard.Root>
			<div className="flex flex-wrap gap-2 w-2/5">
				{options.map((option) => {
					const radioId = `${groupName}-${option.id}`;
					return (
						<label
							key={option.id}
							htmlFor={radioId}
							className={`flex items-center gap-2 rounded-full border border-slate-500 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-blue-400 hover:text-white ${value === option.id ? "bg-slate-700" : "bg-slate-700/40"}`}
						>
							<input
								id={radioId}
								type="radio"
								name={groupName}
								value={option.id}
								checked={value === option.id}
								onChange={(e) => onChange(name, e.target.value)}
								className="h-3.5 w-3.5 accent-blue-500"
							/>
							<span>{option.name}</span>
						</label>
					);
				})}
			</div>
		</div>
	);
};

export default LabelRadioGroup;
