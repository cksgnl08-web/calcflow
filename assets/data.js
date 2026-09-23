/* ══════════════════════════════════════════════════════════
   운영 스위치 — 애드센스 승인 전후로 이 두 줄만 바꾸면 됩니다.
   CF_ADS        : 광고 자리 표시 여부 (승인 전 false, 승인 후 true)
   CF_SHOW_SOON  : "준비 중" 계산기 카드 표시 여부 (승인 전 false 권장)
   ══════════════════════════════════════════════════════════ */
window.CF_ADS = false;
window.CF_SHOW_SOON = false;

/* calcflow 계산기 목록 — 새 계산기를 만들면 여기에 한 줄만 추가하면
   홈·카테고리·검색에 자동으로 나타납니다. status: "live" 또는 "soon"
   added: 공개일 — 공개 후 30일 동안만 NEW 표시 */
window.CALC_CATS=[
  {key:"money", name:"돈·금융",       emoji:"💰", path:"/money/",  desc:"월급, 이자, 세금처럼 돈과 관련된 계산"},
  {key:"life",  name:"날짜·생활",     emoji:"📅", path:"/life/",   desc:"날짜를 세거나 단위를 바꾸는 계산"},
  {key:"health",name:"건강",          emoji:"💪", path:"/health/", desc:"몸 상태와 생활 습관을 숫자로 확인"},
  {key:"tools", name:"사진·문서 도구",emoji:"🛠️", path:"/tools/",  desc:"사진·PDF·글을 업로드 없이 브라우저에서 바로 처리"}
];
window.CALCS=[
  /* 돈·금융 */
  {id:"savings",cat:"money",group:"save",emoji:"🏦",name:"예·적금 이자 계산기",path:"/money/savings/",status:"live",popular:true,
   desc:"만기 수령액을 세후로 계산",kw:"적금 예금 이자 만기 세후 단리 복리 이자소득세"},
  {id:"severance",cat:"money",group:"work",emoji:"📤",name:"퇴직금 계산기",path:"/money/severance/",status:"live",popular:true,
   desc:"평균임금 기준 예상 퇴직금",kw:"퇴직금 평균임금 퇴직 정산"},
  {id:"unemployment",cat:"money",group:"work",emoji:"🧾",name:"실업급여 계산기",path:"/money/unemployment/",status:"live",popular:true,
   desc:"구직급여 예상 지급액",kw:"실업급여 구직급여 고용보험"},
  {id:"net-salary",cat:"money",group:"work",emoji:"💵",name:"연봉 실수령액 계산기",path:"/money/net-salary/",status:"live",popular:true,
   desc:"4대보험·세금 공제 후 월급",kw:"연봉 실수령액 월급 4대보험 세금"},
  {id:"weekly-pay",cat:"money",group:"work",emoji:"⏰",name:"시급·주휴수당 계산기",path:"/money/weekly-pay/",status:"live",popular:true,added:"2026-09-23",
   desc:"주 15시간 조건과 월 환산 급여",kw:"주휴수당 시급 알바 최저임금 주급 월급 환산 10320"},
  {id:"part-time-pay",cat:"money",group:"work",emoji:"💳",name:"알바 월급 실수령액",path:"/money/part-time-pay/",status:"live",added:"2026-09-23",
   desc:"3.3% vs 4대보험 비교",kw:"알바 실수령액 3.3% 4대보험 아르바이트 세금 월급"},
  {id:"maternity-leave",cat:"money",group:"family",emoji:"🤰",name:"출산휴가 급여 계산기",path:"/money/maternity-leave/",status:"live",added:"2026-09-23",
   desc:"90일 급여와 휴가 기간",kw:"출산휴가 급여 출산전후휴가 90일 상한 220만원"},
  {id:"parental-leave",cat:"money",group:"family",emoji:"👶",name:"육아휴직 급여 계산기",path:"/money/parental-leave/",status:"live",popular:true,added:"2026-09-23",
   desc:"월 최대 250만원·6+6 특례",kw:"육아휴직 급여 6+6 부모육아휴직 상한 250만원 한부모"},
  {id:"child-benefit",cat:"money",group:"family",emoji:"🍼",name:"부모급여·아동수당 계산기",path:"/money/child-benefit/",status:"live",added:"2026-09-23",
   desc:"첫만남이용권까지 지원금 총액",kw:"부모급여 아동수당 첫만남이용권 출산지원금 육아 지원금"},
  {id:"subscription-score",cat:"money",group:"house",emoji:"🏢",name:"청약 가점 계산기",path:"/money/subscription-score/",status:"live",popular:true,added:"2026-09-23",
   desc:"84점 만점 항목별 계산",kw:"청약 가점 무주택기간 부양가족 청약통장 84점"},
  {id:"acquisition-tax",cat:"money",group:"house",emoji:"🔑",name:"취득세 계산기",path:"/money/acquisition-tax/",status:"live",added:"2026-09-23",
   desc:"주택 취득세율·생애최초 감면",kw:"취득세 주택 취득세율 생애최초 감면 다주택 중과 지방교육세"},
  {id:"loan",cat:"money",group:"house",emoji:"🏛️",name:"대출 이자 계산기",path:"/money/loan/",status:"live",
   desc:"원리금균등·원금균등·만기일시 비교",kw:"대출 이자 원리금균등 원금균등 만기일시 전세자금대출 상환"},
  {id:"jeonse-conversion",cat:"money",group:"house",emoji:"🏠",name:"전월세 전환 계산기",path:"/money/jeonse-conversion/",status:"live",popular:true,
   desc:"전세↔월세 환산과 법정 상한",kw:"전월세 전환율 전세 월세 반전세 보증금 법정상한"},
  {id:"brokerage-fee",cat:"money",group:"house",emoji:"🏘️",name:"부동산 중개수수료 계산기",path:"/money/brokerage-fee/",status:"live",popular:true,
   desc:"매매·전세·월세 복비 상한",kw:"중개수수료 복비 중개보수 부동산 요율"},
  {id:"vat",cat:"money",group:"save",emoji:"🧮",name:"부가세 계산기",path:"/money/vat/",status:"soon",
   desc:"공급가액과 합계금액 역산",kw:"부가세 부가가치세 공급가액 세금계산서"},
  {id:"percent",cat:"money",group:"save",emoji:"％",name:"퍼센트·할인율 계산기",path:"/money/percent/",status:"soon",
   desc:"할인가와 증감률 계산",kw:"퍼센트 할인율 증감률 비율"},
  {id:"military-pay",cat:"money",group:"work",emoji:"🎖️",name:"군인 월급·적금 계산기",path:"/money/military-pay/",status:"live",popular:true,
   desc:"봉급과 내일준비적금 만기액",kw:"군인 월급 봉급 병장 장병내일준비적금 군적금 매칭"},

  /* 날짜·생활 */
  {id:"discharge",cat:"life",emoji:"🪖",name:"군 전역일 계산기",path:"/life/discharge/",status:"live",popular:true,
   desc:"실시간 복무율과 진급 일정",kw:"전역일 군대 복무율 진급 디데이 군인"},
  {id:"age",cat:"life",emoji:"🎂",name:"만 나이 계산기",path:"/life/age/",status:"live",popular:true,
   desc:"만 나이·연 나이·세는 나이 비교",kw:"만나이 나이 연나이 세는나이 생일"},
  {id:"pyeong",cat:"life",emoji:"📐",name:"평수 ↔ ㎡ 변환기",path:"/life/pyeong/",status:"live",popular:true,
   desc:"평과 제곱미터를 서로 변환",kw:"평수 제곱미터 면적 전용면적 공급면적 변환"},
  {id:"dday",cat:"life",emoji:"📆",name:"D-day·기념일 계산기",path:"/life/dday/",status:"soon",
   desc:"100일·1000일과 날짜 간격",kw:"디데이 기념일 100일 날짜계산"},
  {id:"gpa",cat:"life",emoji:"🎓",name:"학점 변환 계산기",path:"/life/gpa/",status:"soon",
   desc:"4.5 ↔ 4.3 ↔ 100점 환산",kw:"학점 변환 GPA 환산"},
  {id:"airport-parking",cat:"life",emoji:"✈️",name:"공항 주차비 계산기",path:"/life/airport-parking/",status:"live",popular:true,added:"2026-09-21",
   desc:"공항별 단기·장기 주차 요금",kw:"공항 주차비 인천공항 김포공항 장기주차"},
  {id:"electricity",cat:"life",emoji:"💡",name:"전기요금 계산기",path:"/life/electricity/",status:"soon",
   desc:"주택용 누진제 기준 요금",kw:"전기요금 누진제 한전 전기세"},

  /* 건강 */
  {id:"bmr-tdee",cat:"health",emoji:"🔥",name:"기초대사량·TDEE 계산기",path:"/health/bmr-tdee/",status:"live",popular:true,
   desc:"하루 필요 열량과 목표 섭취량",kw:"기초대사량 BMR TDEE 칼로리 다이어트 유지칼로리"},
  {id:"bmi",cat:"health",emoji:"⚖️",name:"BMI 계산기",path:"/health/bmi/",status:"soon",
   desc:"국내 기준 체질량지수",kw:"BMI 체질량지수 비만도"},
  {id:"due-date",cat:"health",emoji:"🤰",name:"출산예정일 계산기",path:"/health/due-date/",status:"soon",
   desc:"임신 주수와 출산예정일",kw:"출산예정일 임신 주수 분만"},
  {id:"sleep",cat:"health",emoji:"😴",name:"수면 사이클 계산기",path:"/health/sleep/",status:"soon",
   desc:"기상·취침 시각 역산",kw:"수면 사이클 기상시간 취침시간"},
  {id:"water",cat:"health",emoji:"💧",name:"하루 물 섭취량 계산기",path:"/health/water/",status:"soon",
   desc:"체중·활동량 기준 권장량",kw:"물 섭취량 수분 하루권장량"},
  {id:"running-pace",cat:"health",emoji:"🏃",name:"러닝 페이스 계산기",path:"/health/running-pace/",status:"soon",
   desc:"페이스와 예상 완주 기록",kw:"러닝 페이스 마라톤 기록 속도"},

  /* 도구 — group: 도구 허브에서 묶어 보여줄 소분류 */
  {id:"image-resize",cat:"tools",group:"edit",emoji:"📐",name:"이미지 크기 조절",path:"/tools/image-resize/",status:"live",popular:true,added:"2026-09-21",
   desc:"픽셀·비율로 여러 장 한 번에",kw:"이미지 크기 조절 사진 리사이즈 픽셀 줄이기 resize"},
  {id:"image-compress",cat:"tools",group:"edit",emoji:"🗜️",name:"이미지 용량 줄이기",path:"/tools/image-compress/",status:"live",popular:true,added:"2026-09-21",
   desc:"200KB·1MB 이하로 자동 압축",kw:"이미지 압축 용량 줄이기 사진 크기 KB 제출"},
  {id:"image-convert",cat:"tools",group:"edit",emoji:"🔁",name:"이미지 포맷 변환",path:"/tools/image-convert/",status:"live",added:"2026-09-21",
   desc:"JPG·PNG·WEBP 서로 바꾸기",kw:"이미지 변환 png jpg webp 확장자 포맷"},
  {id:"image-crop",cat:"tools",group:"edit",emoji:"✂️",name:"이미지 자르기",path:"/tools/image-crop/",status:"live",added:"2026-09-21",
   desc:"1:1·4:5·16:9 비율로 크롭",kw:"이미지 자르기 크롭 사진 자르기 인스타 비율"},
  {id:"image-rotate",cat:"tools",group:"edit",emoji:"🔄",name:"이미지 회전·반전",path:"/tools/image-rotate/",status:"live",added:"2026-09-21",
   desc:"90도 회전, 좌우·상하 뒤집기",kw:"이미지 회전 사진 돌리기 좌우반전 뒤집기"},
  {id:"id-photo",cat:"tools",group:"photo",emoji:"🪪",name:"증명·여권사진 규격 맞추기",path:"/tools/id-photo/",status:"live",popular:true,added:"2026-09-21",
   desc:"3.5×4.5·반명함·비자 사진",kw:"증명사진 여권사진 규격 반명함 3.5x4.5 비자사진 인화"},
  {id:"image-split",cat:"tools",group:"photo",emoji:"🧩",name:"사진 분할",path:"/tools/image-split/",status:"live",added:"2026-09-21",
   desc:"2·4·9·16분할, 인스타 그리드",kw:"사진 분할 이미지 나누기 인스타 그리드 9분할"},
  {id:"watermark",cat:"tools",group:"photo",emoji:"💧",name:"사진 워터마크 넣기",path:"/tools/watermark/",status:"live",added:"2026-09-21",
   desc:"글자·로고 워터마크 일괄 적용",kw:"워터마크 넣기 사진 로고 저작권 표시"},
  {id:"mosaic",cat:"tools",group:"photo",emoji:"🟫",name:"사진 모자이크·블러",path:"/tools/mosaic/",status:"live",added:"2026-09-21",
   desc:"얼굴·번호판·개인정보 가리기",kw:"모자이크 블러 사진 가리기 얼굴 번호판 개인정보"},
  {id:"qr",cat:"tools",group:"photo",emoji:"🔳",name:"QR코드 만들기",path:"/tools/qr/",status:"live",popular:true,added:"2026-09-21",
   desc:"링크·와이파이·연락처 QR",kw:"QR코드 생성 큐알 만들기 와이파이 QR"},
  {id:"pdf-merge",cat:"tools",group:"pdf",emoji:"📎",name:"PDF 합치기",path:"/tools/pdf-merge/",status:"live",popular:true,added:"2026-09-21",
   desc:"여러 PDF를 하나로 병합",kw:"PDF 합치기 병합 여러개 하나로 merge"},
  {id:"pdf-split",cat:"tools",group:"pdf",emoji:"📑",name:"PDF 나누기·페이지 추출",path:"/tools/pdf-split/",status:"live",added:"2026-09-21",
   desc:"원하는 페이지만 뽑기·삭제",kw:"PDF 나누기 분할 페이지 추출 삭제 split"},
  {id:"image-to-pdf",cat:"tools",group:"pdf",emoji:"🗂️",name:"이미지 → PDF 변환",path:"/tools/image-to-pdf/",status:"live",added:"2026-09-21",
   desc:"사진 여러 장을 PDF 하나로",kw:"이미지 PDF 변환 사진 PDF 만들기 JPG PDF"},
  {id:"pdf-to-image",cat:"tools",group:"pdf",emoji:"🖼️",name:"PDF → 이미지 변환",path:"/tools/pdf-to-image/",status:"live",added:"2026-09-21",
   desc:"페이지별 JPG·PNG로 저장",kw:"PDF 이미지 변환 PDF JPG PNG 페이지 저장"},
  {id:"signature",cat:"tools",group:"pdf",emoji:"✍️",name:"서명 만들기·문서에 넣기",path:"/tools/signature/",status:"live",added:"2026-09-21",
   desc:"손글씨 서명을 PDF·사진에",kw:"전자서명 서명 만들기 PDF 서명 넣기 사인"},
  {id:"video-to-gif",cat:"tools",group:"gif",emoji:"🎞️",name:"영상 → GIF 만들기",path:"/tools/video-to-gif/",status:"live",added:"2026-09-21",
   desc:"원하는 구간만 움짤로",kw:"영상 GIF 변환 움짤 만들기 동영상 gif mp4"},
  {id:"screen-gif",cat:"tools",group:"gif",emoji:"🖥️",name:"화면 녹화 → GIF",path:"/tools/screen-gif/",status:"live",added:"2026-09-21",
   desc:"PC 화면을 녹화해 움짤로",kw:"화면 녹화 GIF 화면캡처 움짤 설치없이"},
  {id:"char-count",cat:"tools",group:"text",emoji:"🔤",name:"글자수 세기",path:"/tools/char-count/",status:"live",popular:true,added:"2026-09-21",
   desc:"공백 포함·제외, 바이트, 원고지",kw:"글자수 세기 공백포함 바이트 자소서 원고지"},
  {id:"blog-format",cat:"tools",group:"text",emoji:"📝",name:"블로그 본문 정리",path:"/tools/blog-format/",status:"live",added:"2026-09-21",
   desc:"문장마다 줄바꿈·해시태그",kw:"블로그 줄바꿈 본문 정리 해시태그 문단"},
  {id:"rename",cat:"tools",group:"text",emoji:"🏷️",name:"파일명 일괄 변경",path:"/tools/rename/",status:"live",added:"2026-09-21",
   desc:"번호·날짜로 이름 한 번에",kw:"파일명 일괄 변경 이름 바꾸기 번호 붙이기 rename"},
  {id:"unit",cat:"tools",group:"text",emoji:"📏",name:"단위 변환기",path:"/tools/unit/",status:"soon",
   desc:"길이·무게·온도·부피 변환",kw:"단위변환 길이 무게 온도 부피"}
];

/* 세트: 하나의 상황을 여러 계산기로 이어서 푸는 묶음.
   각 단계의 입력값은 다음 단계로 자동으로 넘어갑니다. */
/* 도구 허브 소분류 */
window.CALC_GROUPS={
  work:{name:"월급·일자리",desc:"실수령액, 퇴직금, 실업급여, 알바"},
  family:{name:"출산·육아",desc:"출산휴가, 육아휴직, 아이 지원금"},
  house:{name:"집·부동산",desc:"청약, 취득세, 전월세, 대출"},
  save:{name:"저축·이자",desc:"예·적금 이자"},
  edit:{name:"이미지 편집",desc:"크기·용량·형식·자르기·회전"},
  photo:{name:"사진 활용",desc:"증명사진, 분할, 워터마크, 모자이크, QR"},
  pdf:{name:"PDF·서명",desc:"합치기, 나누기, 변환, 서명 넣기"},
  gif:{name:"움짤(GIF)",desc:"영상이나 화면 녹화를 GIF로"},
  text:{name:"글·파일",desc:"글자수, 본문 정리, 파일 이름"}
};

window.CALC_SETS={
  quit:{name:"퇴사 세트",emoji:"📤",desc:"퇴직금 → 실업급여 → 연봉 실수령액. 입력한 급여가 다음 계산기로 이어져요.",steps:[
    {id:"severance",title:"퇴직금",path:"/money/severance/",hint:"퇴사할 때 받을 금액부터 확인해요."},
    {id:"unemployment",title:"실업급여",path:"/money/unemployment/",hint:"입력한 급여로 하루 얼마를 며칠 받는지 이어서 계산해요."},
    {id:"net-salary",title:"연봉 실수령액",path:"/money/net-salary/",hint:"다음 직장 연봉을 넣으면 실제 통장에 들어올 금액이 나와요."}
  ]},
  military:{name:"전역 세트",emoji:"🪖",desc:"전역일 → 군인 월급·적금 → 전역 후 예·적금. 전역할 때 모이는 돈까지 계산해요.",steps:[
    {id:"discharge",title:"전역일",path:"/life/discharge/",hint:"입대일과 군종부터 넣어요."},
    {id:"military-pay",title:"군인 월급·적금",path:"/money/military-pay/",hint:"복무 기간 동안 모이는 봉급과 적금을 이어서 계산해요."},
    {id:"savings",title:"전역 후 예·적금",path:"/money/savings/",hint:"전역할 때 받은 목돈을 어떻게 굴릴지 계산해요."}
  ]},
  move:{name:"이사 세트",emoji:"🏠",desc:"전월세 전환 → 중개수수료 → 대출 이자. 환산한 월세가 그대로 넘어가요.",steps:[
    {id:"jeonse-conversion",title:"전월세 전환",path:"/money/jeonse-conversion/",hint:"전세와 월세 중 어느 쪽이 유리한지부터 봐요."},
    {id:"brokerage-fee",title:"중개수수료",path:"/money/brokerage-fee/",hint:"정해진 보증금·월세로 복비 상한을 이어서 계산해요."},
    {id:"loan",title:"대출 이자",path:"/money/loan/",hint:"보증금을 대출로 채운다면 매달 이자가 얼마인지 확인해요."}
  ]},
  part:{name:"알바 세트",emoji:"🧑‍🍳",desc:"시급·주휴수당 → 3.3% vs 4대보험 실수령 → 퇴직금. 근무시간만 넣으면 끝까지 이어져요.",steps:[
    {id:"weekly-pay",title:"시급·주휴수당",path:"/money/weekly-pay/",hint:"시급과 근무시간으로 주휴수당과 월급부터 계산해요."},
    {id:"part-time-pay",title:"알바 실수령액",path:"/money/part-time-pay/",hint:"그 월급에서 3.3%를 떼는 경우와 4대보험 가입 시 실수령액을 비교해요."},
    {id:"severance",title:"퇴직금",path:"/money/severance/",hint:"1년 이상 일했다면 같은 월급으로 퇴직금을 계산해요."}
  ]},
  baby:{name:"육아 세트",emoji:"👶",desc:"출산휴가 급여 → 육아휴직 급여 → 부모급여·아동수당. 아이가 태어나면 받는 돈을 한 번에.",steps:[
    {id:"maternity-leave",title:"출산휴가 급여",path:"/money/maternity-leave/",hint:"출산휴가 90일 동안 받는 돈부터 계산해요."},
    {id:"parental-leave",title:"육아휴직 급여",path:"/money/parental-leave/",hint:"같은 월급으로 육아휴직 기간에 달마다 받는 돈을 이어서 계산해요."},
    {id:"child-benefit",title:"부모급여·아동수당",path:"/money/child-benefit/",hint:"출생일로 아이가 받는 지원금 총액을 계산해요."}
  ]},
  home:{name:"내 집 마련 세트",emoji:"🔑",desc:"청약 가점 → 취득세 → 대출 이자. 당첨부터 잔금 대출까지 순서대로.",steps:[
    {id:"subscription-score",title:"청약 가점",path:"/money/subscription-score/",hint:"내 청약 가점이 몇 점인지부터 확인해요."},
    {id:"acquisition-tax",title:"취득세",path:"/money/acquisition-tax/",hint:"집값으로 취득세와 필요한 대출금을 계산해요."},
    {id:"loan",title:"대출 이자",path:"/money/loan/",hint:"부족한 금액을 대출받으면 매달 얼마를 갚는지 계산해요."}
  ]}
};
