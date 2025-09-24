# Request Log

## 2025-09-24
- run-exe가 실행될 때 third-party 폴더의 `Input_Total` 파일을 업데이트한 뒤 EXE 실행은 건너뛰도록 수정
- 앞으로 사용자가 전달하는 프롬프트를 이 파일에 기록해 언제든 동일한 요청 상태로 되돌릴 수 있도록 준비
- [13:54:44] monitor.tsx 입력값 숫자 validation, 비숫자 입력 시 테두리 강조 및 Play 버튼 비활성화, debounce 유지, 재실행 후에도 입력값 유지 확인
- [14:36:05] request.md 로그 지속 기록 및 monitor.tsx 입력값 숫자 validation(비숫자 입력 시 테두리 강조·Play 비활성, debounce 유지, 재실행 후 값 유지) 2차 진행 요청
- [15:22:07] BaseContentHeader 우측 로그 확인 버튼 추가 및 최근 5일 MHySIM.jsonl 기반 로그 모달 구현 요청
