import { Toast } from "radix-ui";
import { useEffect, useRef } from "react";
import "@/css/toast.css";

interface BaseToastInterface {
	open: boolean;
	setOpen: (arg0: boolean) => void;
	toastMessage: string;
}

const BaseToast = ({
	open,
	setOpen,
	toastMessage = "Sample Toast Message",
}: BaseToastInterface) => {
	const eventDateRef = useRef(new Date());
	const timerRef = useRef(0);

	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	return (
		<Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
			<Toast.Title className="ToastTitle">{toastMessage}</Toast.Title>
			<Toast.Description asChild>
				<time
					className="ToastDescription"
					dateTime={eventDateRef.current.toISOString()}
				>
					{prettyDate(eventDateRef.current)}
				</time>
			</Toast.Description>
			<Toast.Action
				className="ToastAction"
				asChild
				altText="Goto schedule to undo"
			>
				<button type="button" className="Button small green">
					close
				</button>
			</Toast.Action>
		</Toast.Root>
	);
};
function prettyDate(date: Date) {
	return new Intl.DateTimeFormat("ko-KR", {
		dateStyle: "medium", // 예: 2024. 6. 10.
		timeStyle: "short", // 예: 오후 3:45
	}).format(date);
}

export default BaseToast;
