# Request Log

## 2025-09-24
- run-exe가 실행될 때 third-party 폴더의 `Input_Total` 파일을 업데이트한 뒤 EXE 실행은 건너뛰도록 수정
- 앞으로 사용자가 전달하는 프롬프트를 이 파일에 기록해 언제든 동일한 요청 상태로 되돌릴 수 있도록 준비
- [13:54:44] monitor.tsx 입력값 숫자 validation, 비숫자 입력 시 테두리 강조 및 Play 버튼 비활성화, debounce 유지, 재실행 후에도 입력값 유지 확인
- [14:36:05] request.md 로그 지속 기록 및 monitor.tsx 입력값 숫자 validation(비숫자 입력 시 테두리 강조·Play 비활성, debounce 유지, 재실행 후 값 유지) 2차 진행 요청
- [15:22:07] BaseContentHeader 우측 로그 확인 버튼 추가 및 최근 5일 MHySIM.jsonl 기반 로그 모달 구현 요청
- [15:38:18] run-exe 결과로 Output_Total(엑셀/CSV) 파싱, 출력 속성 타임라인 및 시간바 연동 구현
- [16:26:31] BaseContentHeader에 시뮬레이션 스크러버 추가, 드래그 시 출력값 시간대 매칭
- [17:09:10] PSV 계산 모달 입력값 기반 run-exe 실행/Output_Total 매핑 및 그래프 출력 기능 구현
- [17:31:21] PSV 모달 차트 변수 매핑 오류 수정 및 그래프 표시 안정화 요청
- [17:31:21] 모니터 입력 검증 실패 시 재생 제어 비활성화 및 타임라인 컴포넌트 안정화 요청
