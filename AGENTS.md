# Repository Guidelines

## Project Structure & Module Organization
이 앱은 `src/`의 Vite 기반 React 렌더러와 `electron/`의 Electron 메인 프로세스로 구성됩니다. UI 컴포넌트는 `src/components`, 페이지 단위 화면은 `src/pages`, 전역 상태는 Zustand 스토어 `src/store`에 위치합니다. 공용 헬퍼는 `src/lib`와 `electron/utils`에 모여 있으며, 렌더러 진입점은 `src/main.tsx`, 메인 프로세스 진입점은 `electron/main.ts`입니다. 빌드 결과물은 `dist/`, `dist-electron/`에 생성되며, 외부 실행 파일과 Excel 템플릿은 항상 `third-party/`에, 시뮬레이션 결과물은 `output/`에 보관하세요.

## Build, Test, and Development Commands
- `npm run dev`: Vite와 Electron을 동시에 실행하여 핫 리로드 개발 환경을 제공합니다.
- `npm run build`: 타입 검사 후 렌더러를 빌드하고 `electron-builder`로 설치 패키지를 생성합니다.
- `npm run preview`: 프로덕션 번들을 로컬에서 스모크 테스트용으로 서빙합니다.
- `npm run test` / `npm run test:ui`: Vitest 테스트를 CLI 또는 대시보드 UI로 실행합니다.
- `npm run coverage`: Vitest + Istanbul 커버리지를 수집하여 `coverage/`에 보고서를 생성합니다.

## Coding Style & Naming Conventions
`npm run lint`로 검증하고, `npm run lint:fix` 또는 `npm run format`으로 Biome 규칙을 적용합니다. 포매터는 탭 들여쓰기와 더블 쿼트, 정렬된 import를 강제하므로 미사용 심볼을 남기지 마세요. 컴포넌트는 PascalCase(`components/Button.tsx`), 훅과 유틸은 camelCase(`hooks/useHydrogen.ts`), 상수는 `src/constants`에서 SCREAMING_SNAKE_CASE를 유지합니다. 가능한 한 TypeScript 타입을 명시하고 `any`는 지양합니다.

## Testing Guidelines
Vitest와 React Testing Library를 사용하며 테스트는 `src/__tests__` 하위에 `*.test.tsx` 패턴으로 배치합니다(`src/__tests__/pages/app.test.tsx` 참조). 검증은 렌더링 결과나 IPC 효과 등 관찰 가능한 동작에 집중하고, Electron 경계는 필요한 경우에만 목킹하세요. 새 기능을 추가할 때는 관련 테스트를 동반하고, PR 전 `npm run coverage`로 커버리지 회귀가 없는지 확인합니다.

## Commit & Pull Request Guidelines
최근 커밋은 `Sync basic data values with Basic_Da device`처럼 명령형·서술형 제목을 선호하므로 단문 요약을 피하세요. 변경 사항은 논리적으로 묶어 커밋하고, Electron 프로세스나 번들 자산을 수정할 때는 본문에 배경을 추가합니다. PR에는 사용자 영향, 실행한 검증 명령, 관련 이슈 링크를 포함하고 UI 변화가 있다면 스크린샷이나 GIF를 첨부하세요.

## Environment & Packaging Notes
패키징된 앱은 Windows 전용 실행 파일(`third-party/`)에 의존하므로 `electron-builder.json5` 설정에 포함되어 있는지 항상 확인합니다. macOS·Linux에서 개발할 때는 Windows 전용 로직을 가드하여 런타임 오류를 방지하고, 산출물 공유 전 `output/`에서 민감한 데이터를 정리하세요.
