import Manual from "@/pages/manual/Manual";
import Monitor from "@/pages/monitor/Monitor";
import Report from "@/pages/report/Report";
import { Route, Routes } from "react-router-dom";
const MainRouter = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Monitor />} />
				<Route path="/report" element={<Report />} />

				<Route path="/manual" element={<Manual />} />
				{/* <Route path="/economic-evaluation" element={<EconomicEvaluation />} /> */}
			</Routes>
		</>
	);
};

export default MainRouter;
