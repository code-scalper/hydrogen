const Manual = () => {
        const sections = [
                {
                        id: "project",
                        title: "프로젝트 관리",
                        description:
                                "데이터 흐름을 관리하는 기본 단위입니다. 프로젝트를 생성하고 삭제하는 과정을 통해 깔끔한 작업 공간을 유지할 수 있습니다.",
                        steps: [
                                "우측 상단의 \"새 프로젝트\" 버튼을 눌러 이름과 설명을 입력하면 프로젝트가 생성됩니다.",
                                "프로젝트 목록에서 항목을 선택하면 상세 패널이 열리고, 여기에서 \"삭제\" 버튼으로 프로젝트를 정리할 수 있습니다.",
                        ],
                },
                {
                        id: "scenario",
                        title: "시나리오 관리",
                        description:
                                "프로젝트 안에서 다양한 가정과 조건을 실험하기 위한 공간입니다. 각각의 시나리오는 고유한 규칙을 가질 수 있습니다.",
                        steps: [
                                "선택한 프로젝트의 시나리오 영역에서 \"시나리오 추가\"를 클릭하여 새 시나리오를 등록합니다.",
                                "시나리오 세부 화면에서 불필요한 시나리오는 \"삭제\"로 정리하고, 필요한 규칙을 조건별로 추가해 실행 기준을 정의합니다.",
                                "규칙은 순서대로 평가되며, 각 규칙의 조건을 만족할 경우에만 이후 단계가 진행됩니다.",
                        ],
                },
                {
                        id: "sfc",
                        title: "SFC 활성화",
                        description:
                                "SFC(Standard Flow Controller)는 구조화된 흐름을 한눈에 보여주는 뷰입니다. 폴더를 클릭하면 연관된 SFC가 화면에 표시됩니다.",
                        steps: [
                                "왼쪽 탐색 패널에서 원하는 폴더를 선택합니다.",
                                "폴더를 클릭하는 즉시 해당 폴더에 연결된 SFC가 중앙 뷰에 활성화되어 단계별 흐름을 시각적으로 확인할 수 있습니다.",
                                "활성화된 SFC는 시나리오 규칙과 연동되어, 조건 변화가 있을 때 실시간으로 상태가 반영됩니다.",
                        ],
                },
        ];

        const navigationTips = [
                {
                        title: "홈",
                        detail: "현재 진행 중인 프로젝트와 주요 지표를 한눈에 확인합니다.",
                },
                {
                        title: "모니터",
                        detail: "시뮬레이션 실행 결과와 실시간 상태 변화를 추적합니다.",
                },
                {
                        title: "리포트",
                        detail: "실행 이력과 통계를 분석해 인사이트를 도출합니다.",
                },
                {
                        title: "매뉴얼",
                        detail: "이 페이지에서 주요 기능의 사용 방법을 안내합니다.",
                },
        ];

        return (
                <main className="min-h-screen bg-slate-950">
                        <div className="relative mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/40">
                                        <div className="flex flex-col gap-6 text-slate-200">
                                                <header className="flex flex-col gap-3">
                                                        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">사용자 가이드</p>
                                                        <h1 className="text-4xl font-semibold text-white">Hydrogen 운영 매뉴얼</h1>
                                                        <p className="max-w-3xl text-base leading-relaxed text-slate-300">
                                                                주요 기능을 빠르게 이해하고 사용할 수 있도록 핵심 동작을 정리했습니다. 아래 안내를 따라
                                                                프로젝트를 관리하고 시나리오를 설정해 효율적인 시뮬레이션 환경을 구축해 보세요.
                                                        </p>
                                                </header>
                                                <nav className="flex flex-wrap gap-3">
                                                        {sections.map((section) => (
                                                                <a
                                                                        key={section.id}
                                                                        href={`#${section.id}`}
                                                                        className="group inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
                                                                >
                                                                        <span className="h-2 w-2 rounded-full bg-sky-400 transition group-hover:bg-sky-300" />
                                                                        {section.title}
                                                                </a>
                                                        ))}
                                                        <a
                                                                href="#navigation"
                                                                className="group inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
                                                        >
                                                                <span className="h-2 w-2 rounded-full bg-emerald-400 transition group-hover:bg-emerald-300" />
                                                                네비게이션 안내
                                                        </a>
                                                </nav>
                                        </div>
                                </div>

                                <section className="grid gap-10">
                                        {sections.map((section) => (
                                                <article
                                                        key={section.id}
                                                        id={section.id}
                                                        className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30"
                                                >
                                                        <div className="flex flex-col gap-4 text-slate-200">
                                                                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                                                                <p className="text-base leading-relaxed text-slate-300">{section.description}</p>
                                                                <ul className="space-y-3 text-sm leading-relaxed text-slate-200">
                                                                        {section.steps.map((step, index) => (
                                                                                <li key={index} className="flex gap-3">
                                                                                        <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-500/50 bg-sky-500/10 text-xs font-semibold text-sky-300">
                                                                                                {index + 1}
                                                                                        </span>
                                                                                        <span>{step}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        </div>
                                                </article>
                                        ))}
                                </section>

                                <section
                                        id="navigation"
                                        className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30"
                                >
                                        <div className="flex flex-col gap-3 text-slate-200">
                                                <h2 className="text-2xl font-semibold text-white">네비게이션 버튼 안내</h2>
                                                <p className="text-base leading-relaxed text-slate-300">
                                                        화면 좌측의 네비게이션 바를 활용하면 작업 흐름을 빠르게 전환할 수 있습니다. 각 버튼은 다음과 같은 기능을 제공합니다.
                                                </p>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                                {navigationTips.map((tip) => (
                                                        <div
                                                                key={tip.title}
                                                                className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 text-sm text-slate-200"
                                                        >
                                                                <span className="text-base font-medium text-white">{tip.title}</span>
                                                                <span className="leading-relaxed text-slate-300">{tip.detail}</span>
                                                        </div>
                                                ))}
                                        </div>
                                </section>

                                <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-sky-900/60 via-slate-900/80 to-indigo-900/60 p-8 shadow-xl shadow-slate-950/30">
                                        <div className="flex flex-col gap-3 text-slate-200">
                                                <h2 className="text-2xl font-semibold text-white">Time Interval 패널 안내</h2>
                                                <p className="text-base leading-relaxed text-slate-100">
                                                        화면 하단의 <span className="font-semibold text-sky-200">Time Interval</span> 패널은 향후 시뮬레이션 결과를 시간의 흐름에 따라 재생하는 역할을 맡게 됩니다.
                                                        결과 데이터가 확보되면 구간별 변화를 순차적으로 확인하며 실제 운영과 유사한 경험을 제공할 예정입니다.
                                                </p>
                                                <p className="text-sm leading-relaxed text-slate-300">
                                                        현재는 시간대를 미리 구성하는 용도로 활용하며, 추후 업데이트 시 과거-현재-미래 구간의 상태 변화를 직관적으로 비교할 수 있도록 시각화가 추가될 계획입니다.
                                                </p>
                                        </div>
                                </section>
                        </div>
                </main>
        );
};

export default Manual;
