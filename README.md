# calcflow.kr

생활 계산기 모음. 빌드 과정이 없는 정적 사이트라 파일을 올리면 그대로 배포됩니다.

배포: Cloudflare Pages (https://calcflow-2o7.pages.dev) · 도메인 연결 예정: calcflow.kr

## 구조

```
/                     홈 (검색 + 인기 + 카테고리별 전체 목록)
/assets/fonts.css     ★ 폰트 설정 — 사이트 전체 폰트는 이 파일 하나만 고치면 바뀜
/assets/style.css     공통 스타일 (라이트/다크 테마 토큰)
/assets/profile.js    세트 공용 (입력값 이어받기, 결과 링크 공유, 진행 바)
/assets/data.js       계산기 목록 ← 새 계산기를 추가하는 곳
/assets/site.js       테마 전환, 검색(⌘K), 목록 렌더링
/money/ /life/ /health/ /tools/     카테고리 허브 (목록은 data.js에서 자동 생성)
/life/discharge/      군 전역일 계산기 (단독 다크 테마 페이지)
/money/military-pay/  군인 월급·적금 계산기
/life/age/            만 나이 계산기
/life/pyeong/         평수 ↔ ㎡ 변환기
/money/savings/       예·적금 이자 계산기
/money/severance/     퇴직금 계산기         ┐
/money/unemployment/  실업급여 계산기        ├ 퇴사 세트
/money/net-salary/    연봉 실수령액 계산기   ┘
/life/discharge/ → /money/military-pay/ → /money/savings/   전역 세트
/money/jeonse-conversion/ 전월세 전환       ┐
/money/brokerage-fee/     중개수수료         ├ 이사 세트
/money/loan/              대출 이자          ┘
/health/bmr-tdee/     기초대사량·TDEE 계산기
/tools/char-count/    글자수 세기
/about/ /contact/ /privacy/ /terms/   애드센스 승인에 필요한 페이지
404.html  robots.txt  sitemap.xml
```

## 새 계산기 추가하는 법

1. `/assets/data.js`에서 해당 계산기의 `status`를 `"soon"` → `"live"`로 바꿉니다.
   목록에 없는 계산기라면 한 줄을 새로 추가합니다. 홈·카테고리·검색에 자동으로 반영됩니다.
2. 기존 계산기 폴더(예: `/life/age/`)를 복사해 새 폴더를 만들고 `index.html`을 고칩니다.
   - `<title>`, `description`, `canonical`
   - `<h1>`과 계산기 입력 칸
   - 맨 아래 `<script>`의 계산 로직
   - `related-list`의 `data-id`를 새 계산기 id로
3. 본문 순서는 유지합니다. 계산기 → 광고 자리 → 계산 방법 → 기준 표 → 자주 묻는 질문 → 관련 계산기
4. `sitemap.xml`에 새 주소를 추가합니다.

## 폰트 바꾸기

`/assets/fonts.css` 한 파일만 고치면 모든 페이지에 적용됩니다.
1. 파일 맨 위 `@import` 주소를 새 웹폰트 CSS 주소로 교체
2. `--font-sans` / `--font-display` / `--font-num` 값의 맨 앞 폰트 이름을 교체 (뒤쪽 fallback은 유지)

## 세트(시리즈) 만드는 법

1. `/assets/data.js`의 `window.CALC_SETS`에 세트와 단계를 추가합니다.
2. 각 계산기 페이지 본문에 `<div id="set-bar"></div>`(상단)와 `<div id="set-next"></div>`(결과 아래)를 넣습니다.
3. 페이지 스크립트에서 `CF.linkFields(["필드id", ...])`와 `CF.renderSet("세트키","단계id",필드목록)`을 호출합니다.
4. 같은 `id`를 쓰는 입력 칸은 세트 안에서 값이 자동으로 이어집니다. (예: `salary`)

## Cloudflare Pages 설정

| 항목 | 값 |
|---|---|
| Framework preset | None |
| Build command | (비워둠) |
| Build output directory | `/` |
| Production branch | `main` |

## 애드센스 붙이는 순서

1. 계산기가 충분히 쌓이고 `/about/` `/contact/` `/privacy/` `/terms/`가 채워진 뒤 신청합니다.
2. 승인 후 받은 게시자 ID를 각 페이지 `<head>`에 넣습니다.
3. 루트에 `ads.txt`를 만들어 애드센스가 알려주는 한 줄을 넣습니다.
4. 본문의 `<div class="ad-slot">광고 자리</div>`를 실제 광고 단위 코드로 교체합니다.

## 배포 전 확인

- [ ] `/contact/`의 이메일 주소를 실제 주소로 교체
- [ ] 도메인 연결 후 Search Console 등록 + sitemap 제출
- [ ] 기준값(세율·요율·법령)이 바뀌면 해당 페이지의 기준일도 함께 수정
