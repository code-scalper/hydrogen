# progress

## handleRun 메서드 실행시 해당 메서드가 시작시점 부터 종료까지 Loading Progress 표시

## Loading Progress

1. CircularProgress 컴퍼넌트를 사용 하지 않고 새로운 컴퍼넌트 생성
2. runExe실행시에 outputFolder에 MHySIM.log 파일 생성되고 실시간으로 진행상황이 업데이트 됨 업데이트 되는 텍스트는 아래와 같음

[2025-10-23 10:32:27]
[ StatusCode ] PRG0101
[ Description ] 초기화 시작
[ Solution.KO ] 초기화를 시작합니다.
[ Solution.EN ] Initialization starting.

```
[2025-10-23 10:32:35]
[ StatusCode ] INF0150
[ Description ] 패스워드 검증 통과
[ Solution.KO ] 패스워드 검증을 통과했습니다.
[ Solution.EN ] Input password verified.
```

[2025-10-23 10:32:35]
[ StatusCode ] PRG0201
[ Description ] 입력 로드 시작
[ Solution.KO ] 입력 데이터를 불러오는 중입니다.
[ Solution.EN ] Loading inputs.

```
[2025-10-23 10:32:36]
[ StatusCode ] INF0290
[ Description ] 입력 로드 완료
[ Solution.KO ] 입력 로드를 완료했습니다.
[ Solution.EN ] Inputs loaded.
```

[2025-10-23 10:32:36]
[ StatusCode ] PRG0401
[ Description ] 실행 준비(파라미터 설정)
[ Solution.KO ] 실행 준비 중입니다.
[ Solution.EN ] Configuring run.

```
[2025-10-23 10:32:39]
[ StatusCode ] INF0490
[ Description ] 실행 준비 완료
[ Solution.KO ] 실행을 준비했습니다.
[ Solution.EN ] Pre-run configured.
```

[2025-10-23 10:32:39]
[ StatusCode ] PRG0501
[ Description ] 시뮬레이션 실행 시작
[ Solution.KO ] 시뮬레이션을 시작합니다.
[ Solution.EN ] Simulation starting.

```
[2025-10-23 10:32:39]
[ StatusCode ] PRG0601
[ Description ] 입력 검증 시작
[ Solution.KO ] 검증 중입니다.
[ Solution.EN ] Validating inputs.
```

[2025-10-23 10:32:39]
[ StatusCode ] INF0690
[ Description ] 검증 통과
[ Solution.KO ] 입력 검증이 완료되었습니다.
[ Solution.EN ] Validation passed.

```

총 9개의 단계가 있는데, 이 단계를 Loading 컴퍼넌트에 표시해주고자 함. 기존의 circular 대신 새로운 컴퍼넌트를 생성하고
로딩상태를 잘 알 수 있도록 시각화하여 보여줌. 9개 단계를 넘버링해서 현재 9개의 단계중 몇단계가 남아있는지도 확인할 수 있으면 됨.

9단계가 나오거나 실행파일이 오류가 발생하면 로딩창 종료
```
