# calcflow.kr

배포: Cloudflare Pages (https://calcflow-2o7.pages.dev) · 도메인 연결 예정: calcflow.kr

생활 계산기 모음 사이트. 빌드 과정이 없는 정적 HTML이라, 파일을 올리면 그대로 사이트가 됩니다.

## 폴더 구조

```
/                   홈 (전체 계산기 허브)
/assets/style.css   공통 스타일 (모든 페이지가 이 파일 하나를 씁니다)
/money/             돈·금융 허브
/life/              날짜·생활 허브
/life/discharge/    군 전역일 계산기  ← 새 계산기를 만들 때 이 폴더를 복사하세요
/health/            건강 허브
/tools/             사진·글자 도구 허브
/about/ /contact/ /privacy/ /terms/   애드센스 승인에 필요한 페이지
robots.txt  sitemap.xml  404.html
```

주소는 폴더 구조 그대로입니다. `/life/discharge/index.html` → `https://calcflow.kr/life/discharge/`

## 새 계산기 추가하는 법

1. `/life/discharge/` 폴더를 복사해서 새 폴더로 만듭니다. 예: `/money/savings/`
2. `index.html`에서 아래를 고칩니다.
   - `<title>`, `<meta name="description">`, `<link rel="canonical">`
   - `<h1>`과 계산기 입력 칸
   - 맨 아래 `<script>` 안의 계산 로직
3. 본문 섹션은 순서를 그대로 유지합니다. 계산기 → 계산 방법 → 기준 표 → 계산 예시 → 자주 묻는 질문 → 출처·면책 → 관련 계산기
4. 해당 카테고리 허브(`/money/index.html` 등)와 홈(`/index.html`)에서 그 계산기 카드의 `class="card soon"`을 `class="card"`로 바꾸고 `href`를 넣습니다.
5. `sitemap.xml`에 새 주소를 추가합니다.

## Cloudflare Pages 설정

| 항목 | 값 |
|---|---|
| Framework preset | None |
| Build command | (비워둠) |
| Build output directory | `/` |
| Production branch | `main` |

빌드 과정이 없으므로 빌드 명령은 비워야 합니다. 커밋을 푸시하면 자동으로 다시 배포됩니다.

## 애드센스 붙이는 순서

1. 계산기 페이지가 충분히 쌓이고 `/about/` `/contact/` `/privacy/` `/terms/`가 채워진 뒤 신청합니다.
2. 승인 후 받은 게시자 ID(`ca-pub-...`)를 각 페이지 `<head>`의 주석 처리된 스크립트에 넣고 주석을 풉니다.
3. 루트에 `ads.txt` 파일을 만들어 애드센스가 알려주는 한 줄을 넣습니다.
4. 본문의 `<div class="ad-slot">광고 자리</div>`를 실제 광고 단위 코드로 교체합니다.

## 배포 전 확인

- [ ] `/contact/`의 이메일 주소를 실제 주소로 교체
- [ ] 새 페이지를 만들 때마다 sitemap.xml 갱신
- [ ] 기준값(요율·법령·요금표)이 바뀌면 해당 페이지의 기준일도 함께 수정
