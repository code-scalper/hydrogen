import { Routes, Route } from "react-router-dom";
import Monitor from "@/pages/monitor/Monitor";
import Report from "@/pages/report/Report";
import WhatIf from "@/pages/what-if/WhatIf";
import Manual from "@/pages/manual/Manual";
import EconomicEvaluation from "@/pages/economic-evaluation/EconomicEvaluation";
const MainRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Monitor />} />
        <Route path="/report" element={<Report />} />
        <Route path="/what-if" element={<WhatIf />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/economic-evaluation" element={<EconomicEvaluation />} />
      </Routes>
    </>
  );
};

export default MainRouter;
