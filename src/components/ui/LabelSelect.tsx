import * as HoverCard from "@radix-ui/react-hover-card";
import { Avatar, Box, Flex, Heading, Text } from "@radix-ui/themes";
type Option = {
	id: string;
	name: string;
};

interface LabelSelectProps {
	label: string;
	name: string; // dataset의 key를 지정
	unit?: string;
	description?: string;
	options: Option[];
	value: string;
	onChange: (key: string, value: string) => void;
}

const LabelSelect = ({
	label,
	unit = "",
	description = "",
	name,
	options,
	value,
	onChange,
}: LabelSelectProps) => {
	const selectId = `label-select-${name}`;

	return (
		<div className="flex items-center gap-2">
			<HoverCard.Root>
				<HoverCard.Trigger asChild>
					<label
						htmlFor={selectId}
						className="text-xs text-slate-200 mr-3 w-4/5 cursor-pointer flex items-center gap-1"
					>
						{label}
					</label>
					{/* <Link href="https://twitter.com/radix_ui" target="_blank">
            @radix_ui
          </Link> */}
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
			<select
				id={selectId}
				value={value}
				onChange={(e) => onChange(name, e.target.value)}
				className="text-white text-xs bg-gray-700 border-none p-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-800 w-2/5"
			>
				<option value="">선택</option>
				{options.map((option) => (
					<option key={option.id} value={option.id}>
						{option.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default LabelSelect;
