import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  progress: number;
  label?: string;
};

const CircularProgress = ({ progress, label }: Props) => {
  return (
    <div className="fixed w-full h-full z-50 bg-black/20 flex items-center justify-center top-0 left-0">
      <div style={{ width: 150, height: 150 }}>
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: "#0ea5e9",
            textColor: "#0ea5e9",
            trailColor: "#e0f2fe",
          })}
        />

        {label && (
          <p className="text-center mt-2">
            {progress >= 100
              ? "✅ 완료됨"
              : progress >= 95
              ? "🔄 마무리 중..."
              : progress >= 90
              ? "⏳ 거의 다 됐어요..."
              : "⚙️ 계산 중..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
