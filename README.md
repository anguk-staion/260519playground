# PlayGround 안내 페이지

현대건설 AI 활용 소통 커뮤니티 **PlayGround** 의 사내 게시물 페이지입니다.

## 📁 파일 구조

```
playground/
├── index.html        # 페이지 구조
├── styles.css        # 디자인 시스템 + 애니메이션
├── script.js         # 탭 / 모달 / 스크롤 리빌 / 마우스 트랙
├── README.md         # 본 문서
└── assets/
    ├── playground-logo.png   # 상단 PLAYGROUND 워드마크
    └── aidesignlab-logo.png  # 푸터 AI 디자인랩 로고
```

## 🚀 로컬 미리보기

VS Code 의 **Live Server** 확장을 쓰거나 터미널에서:

```bash
cd playground
python3 -m http.server 8000
# http://localhost:8000 접속
```

## 🧩 페이지 구성

| 영역 | 설명 |
|------|------|
| **HERO** | PLAYGROUND 로고 + 부제 "현대건설 AI 활용 소통 커뮤니티" |
| **TAB 1 · 접속 방법** | 좌(Teams) / 우(SharePoint) 카드. 클릭 시 모달 |
| **TAB 2 · 메뉴 소개** | 5 개 카드 (자유게시판 / PlayDay / AI Guide / PlayBook / AI 지원). 호버 시 펼침 |
| **TAB 3 · 팀즈 활용팁** | 클릭 시 인사이드 H 가이드 새 창 오픈 |
| **FOOTER** | AI 디자인랩 로고 |

## ✏️ 모달 본문 채우는 법

`index.html` 하단에 두 개의 모달이 있습니다.  
`<div class="modal__body" data-empty>` 안에 내용을 넣으면, `data-empty` 속성을 제거하면 됩니다.

### Teams 모달 예시

```html
<div class="modal__body">
  <h4>1. Teams 앱 실행</h4>
  <p>설치된 Teams 앱에서 좌측 [채팅] 메뉴를 클릭합니다.</p>

  <h4>2. PlayGround 채널 선택</h4>
  <p>즐겨찾기 → PlayGround 커뮤니티 → [PG 자유게시판] 채널 진입</p>

  <a class="modal__action-btn" href="https://teams.microsoft.com/..." target="_blank">
    Teams 로 바로 이동 ↗
  </a>
</div>
```

`data-empty` 만 제거하면 점선 placeholder 가 사라집니다.

## 🎨 디자인 토큰

`styles.css` 상단 `:root` 에서 색상·폰트·간격·그림자 등을 한 곳에서 관리합니다.

```css
--c-blue:   #4f46e5;
--c-purple: #8b5cf6;
--c-pink:   #ec4899;
--page-w:   900px;   /* 페이지 폭 */
```

## ✨ 주요 인터랙션

- **그라디언트 메쉬 배경** : 3개의 블롭이 18초 주기로 천천히 움직임
- **스파클 애니메이션** : 히어로 진입 시 ✦ 다섯 개가 차례로 등장
- **탭 인디케이터** : 활성 탭 위치로 부드럽게 슬라이드
- **마우스 트랙 3D 틸트** : 접속 방법 카드는 마우스 위치에 따라 살짝 기울어짐
- **호버 펼침** : 메뉴 카드는 마우스 올리면 grid-rows 0fr → 1fr 로 펼쳐짐
- **스크롤 리빌** : `IntersectionObserver` 로 등장 애니메이션
- **히어로 패럴렉스** : 스크롤 시 로고가 부드럽게 페이드/축소
- **반응형** : 920px / 520px 브레이크포인트
- **접근성** : 키보드 ← → 로 탭 이동, ESC 로 모달 닫기, `prefers-reduced-motion` 대응

## 🔗 외부 링크

- 팀즈 활용팁 : `https://autoway.hyundai.net/board/H147/Lists/H14700022/DispForm.aspx?ID=511`
