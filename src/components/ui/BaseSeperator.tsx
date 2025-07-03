import { Separator } from "radix-ui";
import "@/css/seperator.css";

const BaseSeparator = () => (
	<div style={{ width: "100%", maxWidth: 40, margin: "0 10px" }}>
		<div style={{ display: "flex", height: 10, alignItems: "center" }}>
			<Separator.Root
				className="SeparatorRoot"
				decorative
				orientation="vertical"
				style={{ margin: "0 15px" }}
			/>
		</div>
	</div>
);

export default BaseSeparator;
