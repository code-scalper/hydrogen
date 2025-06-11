import {
  GitHubLogoIcon,
  MaskOnIcon,
  NotionLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

import { useState } from "react";
import BaseToast from "../ui/BaseToast";

const WIDTH = 14;
const HEIGHT = 14;
const FooterTools = () => {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string) => {
    setToastMessage(message);
    setOpen(false); // 이전 Toast 닫기
    setTimeout(() => setOpen(true), 10); // 새 Toast 열기 (React state refresh 대응)
    setTimeout(() => setOpen(false), 2000); // 새 Toast 열기 (React state refresh 대응)
  };

  return (
    <div className="flex text-slate-500 space-x-2 font-bold">
      <GitHubLogoIcon
        width={WIDTH}
        height={HEIGHT}
        onClick={() => showToast("아직 구현되지 않은 기능 발동됨!!")}
      />
      <NotionLogoIcon
        width={WIDTH}
        height={HEIGHT}
        onClick={() => showToast("아직 구현되지 않은 기능 발동됨!!")}
      />
      <LinkedInLogoIcon
        width={WIDTH}
        height={HEIGHT}
        onClick={() => showToast("아직 구현되지 않은 기능 발동됨!!")}
      />
      <MaskOnIcon
        width={WIDTH}
        height={HEIGHT}
        onClick={() => showToast("아직 구현되지 않은 기능 발동됨!!")}
      />
      <BaseToast open={open} setOpen={setOpen} toastMessage={toastMessage} />
    </div>
  );
};

export default FooterTools;
