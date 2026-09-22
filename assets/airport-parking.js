/* 공항 주차비 계산기 — 요금 데이터: 2026년 9월 한국공항공사·인천국제공항공사 공식 안내 기준 */
(function(){
"use strict";
const tariff = ({
  grace = 10,
  baseMinutes = 30,
  baseFee = 0,
  unitMinutes = 10,
  unitFee = 0,
  dailyMax,
  peakMax = dailyMax,
  free = false
}) => ({ grace, baseMinutes, baseFee, unitMinutes, unitFee, dailyMax, peakMax, free });

const FREE = tariff({ free: true, dailyMax: 0 });

const AIRPORTS = {
  incheon: {
    name: "인천국제공항",
    code: "ICN",
    source: "https://airport.kr/ap_ko/969/subview.do",
    note: "1일 이상은 장기주차장 이용이 권장됩니다.",
    lots: [
      {
        id: "short",
        name: "단기주차장",
        note: "승용차 전용 · 높이 2.1m 이하",
        rates: {
          small: tariff({ grace: 10, baseMinutes: 30, baseFee: 1200, unitMinutes: 15, unitFee: 600, dailyMax: 24000 })
        }
      },
      {
        id: "long",
        name: "장기주차장",
        note: "제1여객터미널 주차타워 포함",
        rates: {
          small: tariff({ grace: 10, baseMinutes: 60, baseFee: 1000, unitMinutes: 60, unitFee: 1000, dailyMax: 9000 })
        }
      },
      {
        id: "reserved",
        name: "예약주차장",
        note: "사전 예약 필요 · 실제 입출차 시간 기준",
        rates: {
          small: tariff({ grace: 10, baseMinutes: 60, baseFee: 1000, unitMinutes: 60, unitFee: 1000, dailyMax: 9000 })
        }
      },
      {
        id: "cargo",
        name: "화물터미널 주차장",
        note: "최초 45분 무료",
        rates: {
          small: tariff({ grace: 45, baseMinutes: 45, baseFee: 0, unitMinutes: 15, unitFee: 500, dailyMax: 10000 }),
          large: tariff({ grace: 45, baseMinutes: 45, baseFee: 0, unitMinutes: 15, unitFee: 600, dailyMax: 12000 })
        }
      }
    ]
  },
  gimpo: {
    name: "김포국제공항",
    code: "GMP",
    source: "https://www.airport.co.kr/gimpo/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=1360",
    note: "금·토·일 및 법정공휴일은 소형 일 최대요금이 높아집니다.",
    lots: [
      {
        id: "domestic",
        name: "국내선 제1·2주차장",
        note: "국내선 여객 주차장",
        rates: {
          small: tariff({ baseFee: 1000, unitMinutes: 15, unitFee: 500, dailyMax: 20000, peakMax: 30000 }),
          large: tariff({ baseFee: 1200, unitMinutes: 10, unitFee: 400, dailyMax: 40000 })
        }
      },
      {
        id: "international-underground",
        name: "국제선 지하주차장",
        note: "국제선 청사 인접",
        rates: {
          small: tariff({ baseFee: 1000, unitMinutes: 15, unitFee: 500, dailyMax: 20000, peakMax: 30000 }),
          large: tariff({ baseFee: 1200, unitMinutes: 10, unitFee: 400, dailyMax: 40000 })
        }
      },
      {
        id: "international-building",
        name: "국제선 주차빌딩",
        note: "국제선 주차빌딩",
        rates: {
          small: tariff({ baseFee: 1000, unitMinutes: 15, unitFee: 500, dailyMax: 20000, peakMax: 30000 }),
          large: tariff({ baseFee: 1200, unitMinutes: 10, unitFee: 400, dailyMax: 40000 })
        }
      },
      {
        id: "cargo",
        name: "화물청사 주차장",
        note: "소형 일 최대 월~목 12,000원 · 금~일 18,000원",
        rates: {
          small: tariff({ baseFee: 1000, unitMinutes: 15, unitFee: 500, dailyMax: 12000, peakMax: 18000 }),
          large: tariff({ baseFee: 1200, unitMinutes: 10, unitFee: 400, dailyMax: 40000 })
        }
      }
    ]
  },
  gimhae: {
    name: "김해국제공항",
    code: "PUS",
    source: "https://www.airport.co.kr/gimhae/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=190",
    note: "P3는 최초 20분, P1·P2는 최초 10분까지 무료입니다.",
    lots: [
      {
        id: "p1p2",
        name: "P1·P2 여객주차장",
        note: "국내선·국제선 여객 주차장",
        rates: {
          small: tariff({ grace: 10, baseFee: 900, unitMinutes: 10, unitFee: 300, dailyMax: 10000, peakMax: 15000 }),
          large: tariff({ grace: 10, baseFee: 1200, unitMinutes: 10, unitFee: 400, dailyMax: 9000, peakMax: 13000 })
        }
      },
      {
        id: "p3",
        name: "P3 여객·화물주차장",
        note: "주말·성수기 만차 가능 · 최초 20분 무료",
        rates: {
          small: tariff({ grace: 20, baseFee: 900, unitMinutes: 10, unitFee: 300, dailyMax: 7000, peakMax: 10000 }),
          large: tariff({ grace: 20, baseFee: 1200, unitMinutes: 10, unitFee: 400, dailyMax: 5000, peakMax: 7000 })
        }
      }
    ]
  },
  jeju: {
    name: "제주국제공항",
    code: "CJU",
    source: "https://www.airport.co.kr/jeju/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=120",
    note: "P2 장기주차장은 2025년 9월부터 일 최대요금 10% 할인이 적용됩니다.",
    lots: [
      {
        id: "p1",
        name: "P1·국내화물주차장",
        note: "최초 10분 무료",
        rates: {
          small: tariff({ grace: 10, baseFee: 600, unitMinutes: 10, unitFee: 200, dailyMax: 10000, peakMax: 15000 }),
          large: tariff({ grace: 10, baseFee: 800, unitMinutes: 15, unitFee: 400, dailyMax: 16000, peakMax: 24000 })
        }
      },
      {
        id: "p2",
        name: "P2 장기주차장",
        note: "일 최대요금 10% 할인 적용",
        rates: {
          small: tariff({ grace: 10, baseFee: 600, unitMinutes: 10, unitFee: 200, dailyMax: 9000, peakMax: 13500 }),
          large: tariff({ grace: 10, baseFee: 800, unitMinutes: 15, unitFee: 400, dailyMax: 14400, peakMax: 21600 })
        }
      }
    ]
  },
  daegu: {
    name: "대구국제공항",
    code: "TAE",
    source: "https://www.airport.co.kr/daegu/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=170",
    note: "공식 안내상 장기주차·예약주차장은 운영하지 않습니다.",
    lots: [
      {
        id: "passenger",
        name: "여객주차장",
        note: "장기주차 불가 안내 · 이용 전 공식 페이지 확인",
        rates: {
          small: tariff({ grace: 10, baseFee: 800, unitMinutes: 15, unitFee: 400, dailyMax: 13000, peakMax: 15000 }),
          large: tariff({ grace: 10, baseFee: 1100, unitMinutes: 10, unitFee: 400, dailyMax: 14000 })
        }
      }
    ]
  },
  cheongju: {
    name: "청주국제공항",
    code: "CJJ",
    source: "https://www.airport.co.kr/cheongju/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=170",
    note: "제3·4주차장은 제1·2주차장 만차 시에만 운영됩니다.",
    lots: [
      {
        id: "p1p2",
        name: "제1·2주차장",
        note: "소형 전용 · 대형차량 입차 제한",
        rates: {
          small: tariff({ grace: 10, baseFee: 500, unitMinutes: 30, unitFee: 500, dailyMax: 10000 })
        }
      },
      {
        id: "p3p4",
        name: "제3·4주차장",
        note: "제1·2주차장 만차 시 운영 · 소형 전용",
        rates: {
          small: tariff({ grace: 10, baseFee: 500, unitMinutes: 30, unitFee: 500, dailyMax: 6000 })
        }
      },
      {
        id: "p5",
        name: "제5주차장",
        note: "대형차량 전용",
        rates: {
          large: tariff({ grace: 10, baseFee: 500, unitMinutes: 30, unitFee: 500, dailyMax: 10000 })
        }
      }
    ]
  },
  muan: {
    name: "무안국제공항",
    code: "MWX",
    source: "https://www.airport.co.kr/mKor/cms/frCon/index.do?CONTENTS_NO=15&MENU_ID=310",
    note: "현재 공항 활성화를 위해 무료로 운영 중입니다.",
    lots: [{ id: "passenger", name: "여객주차장", note: "무료 운영", rates: { small: FREE, large: FREE } }]
  },
  yangyang: {
    name: "양양국제공항",
    code: "YNY",
    source: "https://www.airport.co.kr/mKor/cms/frCon/index.do?CONTENTS_NO=16&MENU_ID=310",
    note: "현재 공항 활성화를 위해 무료로 개방 중입니다.",
    lots: [{ id: "passenger", name: "여객주차장", note: "무료 개방", rates: { small: FREE, large: FREE } }]
  },
  ulsan: {
    name: "울산공항",
    code: "USN",
    source: "https://www.airport.co.kr/ulsan/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=180",
    note: "최초 10분 무료 · 4시간 10분 이후 일 최대요금 적용",
    lots: [
      {
        id: "passenger",
        name: "여객주차장",
        note: "요일 구분 없이 동일 요금",
        rates: {
          small: tariff({ grace: 10, baseFee: 600, unitMinutes: 10, unitFee: 200, dailyMax: 5000 }),
          large: tariff({ grace: 10, baseFee: 600, unitMinutes: 10, unitFee: 200, dailyMax: 5000 })
        }
      }
    ]
  },
  gwangju: {
    name: "광주공항",
    code: "KWJ",
    source: "https://www.airport.co.kr/gwangju/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=180",
    note: "최초 20분 무료 · 금·토·일은 일 최대 10,000원",
    lots: [
      {
        id: "passenger",
        name: "제1·2주차장",
        note: "사전정산 후 30분 이내 출차",
        rates: {
          small: tariff({ grace: 20, baseFee: 500, unitMinutes: 10, unitFee: 200, dailyMax: 9000, peakMax: 10000 }),
          large: tariff({ grace: 20, baseFee: 800, unitMinutes: 10, unitFee: 300, dailyMax: 9000, peakMax: 10000 })
        }
      }
    ]
  },
  yeosu: {
    name: "여수공항",
    code: "RSU",
    source: "https://www.airport.co.kr/yeosu/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=180",
    note: "요일별 요금이 동일하며 장기주차가 가능합니다.",
    lots: [
      {
        id: "passenger",
        name: "여객주차장",
        note: "최초 10분 무료",
        rates: {
          small: tariff({ grace: 10, baseFee: 500, unitMinutes: 10, unitFee: 200, dailyMax: 5000 }),
          large: tariff({ grace: 10, baseFee: 800, unitMinutes: 10, unitFee: 300, dailyMax: 10000 })
        }
      }
    ]
  },
  pohang: {
    name: "포항경주공항",
    code: "KPO",
    source: "https://www.airport.co.kr/mKor/cms/frCon/index.do?CONTENTS_NO=17&MENU_ID=310",
    note: "2013년 1월부터 무료로 개방하고 있습니다.",
    lots: [{ id: "passenger", name: "여객주차장", note: "무료 개방", rates: { small: FREE, large: FREE } }]
  },
  sacheon: {
    name: "사천공항",
    code: "HIN",
    source: "https://www.airport.co.kr/sacheon/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=180",
    note: "요일별 요금이 동일합니다.",
    lots: [
      {
        id: "passenger",
        name: "여객주차장",
        note: "최초 10분 무료",
        rates: {
          small: tariff({ grace: 10, baseFee: 600, unitMinutes: 10, unitFee: 200, dailyMax: 6000 }),
          large: tariff({ grace: 10, baseFee: 800, unitMinutes: 10, unitFee: 200, dailyMax: 8000 })
        }
      }
    ]
  },
  gunsan: {
    name: "군산공항",
    code: "KUV",
    source: "https://www.airport.co.kr/gunsan/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=170",
    note: "최초 10분 무료 · 버스 주차는 제한될 수 있습니다.",
    lots: [
      {
        id: "passenger",
        name: "여객주차장",
        note: "요일별 요금 동일",
        rates: {
          small: tariff({ grace: 10, baseFee: 600, unitMinutes: 10, unitFee: 200, dailyMax: 6000 }),
          large: tariff({ grace: 10, baseFee: 700, unitMinutes: 10, unitFee: 200, dailyMax: 7000 })
        }
      }
    ]
  },
  wonju: {
    name: "원주공항",
    code: "WJU",
    source: "https://www.airport.co.kr/wonju/cms/frCon/index.do?CONTENTS_NO=2&MENU_ID=180",
    note: "차량 높이 2.6m 이상은 이용할 수 없습니다.",
    lots: [
      {
        id: "passenger",
        name: "여객주차장",
        note: "최초 10분 무료",
        rates: {
          small: tariff({ grace: 10, baseFee: 500, unitMinutes: 10, unitFee: 200, dailyMax: 5000 }),
          large: tariff({ grace: 10, baseFee: 700, unitMinutes: 10, unitFee: 200, dailyMax: 7000 })
        }
      }
    ]
  }
};

const TERMINALS = {
  incheon: [
    { id: "t1", label: "제1여객터미널 (T1)" },
    { id: "t2", label: "제2여객터미널 (T2)" }
  ],
  gimpo: [
    { id: "domestic", label: "국내선 청사" },
    { id: "international", label: "국제선 청사" }
  ],
  gimhae: [
    { id: "domestic", label: "국내선 청사" },
    { id: "international", label: "국제선 청사" }
  ]
};

const MAP_SOURCES = {
  incheon: "https://www.airport.kr/ap_ko/955/subview.do",
  gimpo: "https://www.airport.co.kr/gimpo/cms/frCon/index.do?CONTENTS_NO=1&MENU_ID=1360",
  gimhae: "https://www.airport.co.kr/gimhae/cms/frCon/index.do?CONTENTS_NO=1&MENU_ID=190",
  jeju: "https://www.airport.co.kr/jeju/cms/frCon/index.do?CONTENTS_NO=1&MENU_ID=120",
  cheongju: "https://www.airport.co.kr/cheongju/cms/frCon/index.do?CONTENTS_NO=1&MENU_ID=170"
};

const LOT_ACCESS = {
  incheon: {
    short: { mode: "도보", detail: "선택 터미널 앞 단기주차 구역", rank: 1, terminals: ["t1", "t2"] },
    long: { mode: "셔틀", detail: "장기주차 구역 · 터미널 이동 동선 확인", rank: 2, terminals: ["t1", "t2"] },
    reserved: { mode: "셔틀", detail: "예약 전용 구역 · 사전 예약 필요", rank: 3, status: "사전 예약", terminals: ["t1", "t2"] },
    cargo: { mode: "별도 구역", detail: "화물터미널 이용 차량 중심", rank: 9, status: "화물청사", recommend: false, terminals: [] }
  },
  gimpo: {
    domestic: { mode: "도보", detail: "국내선 청사 인접", rank: 1, terminals: ["domestic"] },
    "international-underground": { mode: "도보", detail: "국제선 청사 인접 지하주차장", rank: 1, terminals: ["international"] },
    "international-building": { mode: "도보", detail: "국제선 주차빌딩", rank: 2, terminals: ["international"] },
    cargo: { mode: "별도 구역", detail: "화물청사 이용 차량 중심", rank: 9, status: "화물청사", recommend: false, terminals: [] }
  },
  gimhae: {
    p1p2: { mode: "도보", detail: "국내선·국제선 여객청사 인접", rank: 1, terminals: ["domestic", "international"] },
    p3: { mode: "순환버스", detail: "무료 순환버스 · 약 10분 간격(05:00~22:50)", rank: 2, terminals: ["domestic", "international"] }
  },
  jeju: {
    p1: { mode: "도보", detail: "여객터미널 앞 주차 구역", rank: 1 },
    p2: { mode: "도보", detail: "장기주차 구역 · 공식 동선 확인", rank: 2 }
  },
  cheongju: {
    p1p2: { mode: "도보", detail: "여객터미널 인접 주차장", rank: 1 },
    p3p4: { mode: "도보", detail: "제1·2주차장 만차 시에만 운영", rank: 3, status: "만차 시 운영", conditional: true, recommend: false },
    p5: { mode: "도보", detail: "대형차량 전용 주차 구역", rank: 2 }
  }
};

const VEHICLES = {
  passenger: {
    feeClass: "small",
    label: "승용차",
    description: "승용차는 전 차종 소형 주차요금으로 분류됩니다."
  },
  "van-small": {
    feeClass: "small",
    label: "15인승 이하 승합차",
    description: "15인승 이하이며 공항별 소형 규격을 충족하면 소형 요금입니다."
  },
  "van-large": {
    feeClass: "large",
    label: "16인승 이상 승합차",
    description: "16인승 이상 승합차는 대형 주차요금으로 분류됩니다."
  },
  "freight-small": {
    feeClass: "small",
    label: "소형 화물·특수차",
    description: "최대적재량 1톤·총중량 3.5톤 이하 기준의 소형 요금입니다."
  },
  "freight-large": {
    feeClass: "large",
    label: "대형 화물·특수차",
    description: "총중량 3.5톤 초과 등 대형 기준 요금입니다."
  }
};

const DISCOUNTS = {
  none: { label: "할인 없음", rate: 0, note: "일반요금이 적용됩니다." },
  compact: { label: "경차 할인", rate: 0.5, note: "행정정보에서 경형자동차로 확인되어야 합니다." },
  low1: { label: "저공해 1종 할인", rate: 0.5, note: "무공해차 통합누리집에서 1종으로 확인되어야 합니다." },
  low2: { label: "저공해 2종 할인", rate: 0.5, note: "무공해차 통합누리집에서 2종으로 확인되어야 합니다." },
  low3: { label: "저공해 3종 할인", rate: 0.2, note: "무공해차 통합누리집에서 3종으로 확인되어야 합니다." },
  "multi-child": { label: "다자녀 할인", rate: 0.5, note: "사전등록 승인 또는 공항별 사후감면 요건이 필요합니다." },
  welfare: { label: "장애인·유공자 할인", rate: 0.5, note: "행정정보 조회 또는 공항별 증빙 요건이 필요합니다." }
};

const $ = (selector) => document.querySelector(selector);
const airportSelect = $("#airport");
const terminalSelect = $("#terminal");
const lotSelect = $("#parking-lot");
const entryInput = $("#entry-time");
const exitInput = $("#exit-time");
const vehicleSelect = $("#vehicle-type");
const errorBox = $("#form-error");
const holidayInput = $("#holiday-date");
const holidayDates = new Set();
let recommendedLotId = null;

function pad(value) {
  return String(value).padStart(2, "0");
}

function toInputValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function setDefaultDates() {
  const entry = new Date();
  entry.setDate(entry.getDate() + 1);
  entry.setHours(9, 0, 0, 0);
  const exit = new Date(entry);
  exit.setDate(exit.getDate() + 3);
  exit.setHours(18, 0, 0, 0);
  entryInput.value = toInputValue(entry);
  exitInput.value = toInputValue(exit);
  holidayInput.min = toDateKey(entry);
  holidayInput.max = toDateKey(exit);
}

function buildAirportOptions() {
  airportSelect.innerHTML = Object.entries(AIRPORTS)
    .map(([id, airport]) => `<option value="${id}">${airport.name} · ${airport.code}</option>`)
    .join("");
}

function terminalOptions() {
  return TERMINALS[airportSelect.value] || [{ id: "main", label: "단일 여객터미널" }];
}

function updateTerminalOptions() {
  const previous = terminalSelect.value;
  const terminals = terminalOptions();
  terminalSelect.innerHTML = terminals
    .map((terminal) => `<option value="${terminal.id}">${terminal.label}</option>`)
    .join("");
  if (terminals.some((terminal) => terminal.id === previous)) terminalSelect.value = previous;
  terminalSelect.disabled = terminals.length <= 1;
}

function currentTerminal() {
  return terminalOptions().find((terminal) => terminal.id === terminalSelect.value) || terminalOptions()[0];
}

function currentVehicle() {
  return VEHICLES[vehicleSelect.value];
}

function currentAirport() {
  return AIRPORTS[airportSelect.value];
}

function eligibleLots() {
  const feeClass = currentVehicle().feeClass;
  return currentAirport().lots.filter((lot) => lot.rates[feeClass]);
}

function accessForLot(lot) {
  const airportAccess = LOT_ACCESS[airportSelect.value] || {};
  return airportAccess[lot.id] || {
    mode: "도보",
    detail: "여객터미널 인접 주차장",
    rank: 1
  };
}

function updateLotOptions() {
  const previous = lotSelect.value;
  const lots = eligibleLots();
  lotSelect.innerHTML = lots.map((lot) => `<option value="${lot.id}">${lot.name}</option>`).join("");
  if (lots.some((lot) => lot.id === previous)) lotSelect.value = previous;
  lotSelect.disabled = lots.length <= 1;
  updateLotNote();
}

function currentLot() {
  return eligibleLots().find((lot) => lot.id === lotSelect.value) || eligibleLots()[0];
}

function updateLotNote() {
  const airport = currentAirport();
  const lot = currentLot();
  $("#lot-note").textContent = lot ? `${lot.note} · ${airport.note}` : airport.note;
}

function updateVehicleClassification() {
  const vehicle = currentVehicle();
  const label = vehicle.feeClass === "small" ? "소형 요금" : "대형 요금";
  $("#vehicle-classification").innerHTML = `<b>${label}</b> · ${vehicle.description}`;
}

function isPeakDate(date) {
  const day = date.getDay();
  return day === 0 || day === 5 || day === 6 || holidayDates.has(toDateKey(date));
}

function priceForSegment(rule, minutes, segmentStart) {
  if (rule.free || minutes <= rule.grace) return 0;

  let amount = rule.baseFee;
  if (minutes > rule.baseMinutes) {
    amount += Math.ceil((minutes - rule.baseMinutes) / rule.unitMinutes) * rule.unitFee;
  }

  const dailyMaximum = isPeakDate(segmentStart) ? rule.peakMax : rule.dailyMax;
  return Math.min(amount, dailyMaximum);
}

function calculateBasePrice(rule, start, end) {
  let cursor = new Date(start);
  let total = 0;
  const segments = [];

  while (cursor < end) {
    const segmentEnd = new Date(Math.min(cursor.getTime() + 24 * 60 * 60 * 1000, end.getTime()));
    const minutes = Math.ceil((segmentEnd - cursor) / 60000);
    const price = priceForSegment(rule, minutes, cursor);
    segments.push({ start: new Date(cursor), minutes, price, peak: isPeakDate(cursor) });
    total += price;
    cursor = segmentEnd;
  }

  return { total, segments };
}

function formatWon(value) {
  return `${Math.max(0, Math.round(value)).toLocaleString("ko-KR")}원`;
}

function formatDuration(start, end) {
  const totalMinutes = Math.max(0, Math.floor((end - start) / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days) parts.push(`${days}일`);
  if (hours) parts.push(`${hours}시간`);
  if (minutes || parts.length === 0) parts.push(`${minutes}분`);
  return parts.join(" ");
}

function showError(message) {
  errorBox.hidden = false;
  errorBox.textContent = message;
  $("#result-status").textContent = "확인 필요";
  $("#result-status").classList.add("error");
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
  $("#result-status").textContent = "계산 완료";
  $("#result-status").classList.remove("error");
}

function selectedDiscount() {
  const selected = document.querySelector('input[name="discount"]:checked');
  return DISCOUNTS[selected ? selected.value : "none"];
}

function updateHolidayLimits() {
  const entry = new Date(entryInput.value);
  const exit = new Date(exitInput.value);
  if (!Number.isNaN(entry.getTime())) holidayInput.min = toDateKey(entry);
  if (!Number.isNaN(exit.getTime())) holidayInput.max = toDateKey(exit);
}

function quoteAllLots(start, end, discount) {
  const feeClass = currentVehicle().feeClass;
  return eligibleLots().map((lot) => {
    const calculation = calculateBasePrice(lot.rates[feeClass], start, end);
    const discountAmount = Math.round(calculation.total * discount.rate);
    return {
      lot,
      calculation,
      discountAmount,
      finalPrice: calculation.total - discountAmount,
      access: accessForLot(lot)
    };
  });
}

function chooseRecommendedQuote(quotes) {
  const terminalId = currentTerminal().id;
  const preferred = quotes.filter(({ access }) => (
    access.recommend !== false
    && (!access.terminals || access.terminals.includes(terminalId))
  ));
  const candidates = preferred.length ? preferred : quotes.filter(({ access }) => access.recommend !== false);
  const fallback = candidates.length ? candidates : quotes;
  return [...fallback].sort((a, b) => (
    a.finalPrice - b.finalPrice || a.access.rank - b.access.rank
  ))[0] || null;
}

function selectLot(lotId) {
  if (!eligibleLots().some((lot) => lot.id === lotId)) return;
  lotSelect.value = lotId;
  calculate();
}

function renderRecommendation(recommended, quotes) {
  const button = $("#use-recommended");
  recommendedLotId = recommended ? recommended.lot.id : null;
  button.disabled = !recommended || recommendedLotId === lotSelect.value;
  button.textContent = recommendedLotId === lotSelect.value ? "선택됨" : "추천 선택";

  if (!recommended) {
    $("#recommended-lot").textContent = "추천 결과를 확인할 수 없어요";
    $("#recommended-reason").textContent = "입력한 시간과 차량 조건을 다시 확인해 주세요.";
    return;
  }

  $("#recommended-lot").textContent = recommended.lot.name;
  const hasCheaperConditionalLot = quotes.some((quote) => (
    quote.access.conditional && quote.finalPrice < recommended.finalPrice
  ));
  const basis = hasCheaperConditionalLot
    ? "조건부 운영 주차장을 제외한 상시 이용 기준"
    : quotes.length > 1
      ? "선택 터미널·운영조건·예상요금 반영"
      : "현재 차량이 이용 가능한 주차장";
  $("#recommended-reason").textContent = `${formatWon(recommended.finalPrice)} · ${basis} · ${recommended.access.mode}`;
}

function renderMap(quotes, recommended) {
  const quoteById = new Map(quotes.map((quote) => [quote.lot.id, quote]));
  const terminal = currentTerminal();
  const lot = currentLot();
  const selectedAccess = lot ? accessForLot(lot) : null;
  $("#map-terminal").textContent = terminal.label;
  $("#map-source").href = MAP_SOURCES[airportSelect.value] || currentAirport().source;
  $("#access-mode").textContent = selectedAccess ? selectedAccess.mode : "이동 정보";
  $("#access-detail").textContent = selectedAccess ? selectedAccess.detail : "이용 가능한 주차장을 확인해 주세요.";

  const container = $("#map-lots");
  container.innerHTML = eligibleLots().map((mapLot) => {
    const quote = quoteById.get(mapLot.id);
    const access = accessForLot(mapLot);
    const classes = ["map-lot"];
    if (mapLot.id === lotSelect.value) classes.push("selected");
    if (recommended && mapLot.id === recommended.lot.id) classes.push("recommended");
    return `<button type="button" class="${classes.join(" ")}" data-map-lot="${mapLot.id}" aria-pressed="${mapLot.id === lotSelect.value}"><b>${mapLot.name}</b><small>${access.mode} · ${quote ? formatWon(quote.finalPrice) : "—"}</small></button>`;
  }).join("");

  container.querySelectorAll("[data-map-lot]").forEach((button) => {
    button.addEventListener("click", () => selectLot(button.dataset.mapLot));
  });
}

function renderComparison(quotes, recommended) {
  const container = $("#lot-comparison");
  const selectedId = lotSelect.value;
  const sorted = [...quotes].sort((a, b) => a.finalPrice - b.finalPrice || a.access.rank - b.access.rank);
  container.innerHTML = sorted.map((quote, index) => {
    const isRecommended = recommended && quote.lot.id === recommended.lot.id;
    const isSelected = quote.lot.id === selectedId;
    const classes = ["comparison-card"];
    if (isRecommended) classes.push("is-recommended");
    if (isSelected) classes.push("is-selected");
    return `<article class="${classes.join(" ")}">
      <div class="ap-cmp-top"><h3>${quote.lot.name}</h3>
        <span>${isRecommended ? '<span class="badge new">추천</span>' : ""}${quote.access.status ? `<span class="badge">${quote.access.status}</span>` : ""}</span></div>
      <strong class="num">${formatWon(quote.finalPrice)}</strong>
      <p>${quote.access.mode} · ${quote.access.detail}</p>
      <button type="button" class="btn ghost" data-compare-lot="${quote.lot.id}" ${isSelected ? "disabled" : ""}>${isSelected ? "현재 선택" : "이 주차장 선택"}</button>
    </article>`;
  }).join("");

  container.querySelectorAll("[data-compare-lot]").forEach((button) => {
    button.addEventListener("click", () => selectLot(button.dataset.compareLot));
  });
}

function renderUnavailableState() {
  renderRecommendation(null, []);
  renderMap([], null);
  $("#lot-comparison").innerHTML = '<p class="muted">입차·출차 시간을 올바르게 입력하면 주차장별 요금이 표시됩니다.</p>';
}

function calculate() {
  updateLotNote();
  updateHolidayLimits();

  const start = new Date(entryInput.value);
  const end = new Date(exitInput.value);
  const airport = currentAirport();
  const lot = currentLot();
  const vehicle = currentVehicle();
  const discount = selectedDiscount();

  if (!entryInput.value || !exitInput.value || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    showError("입차와 출차 일시를 모두 입력해 주세요.");
    renderUnavailableState();
    return;
  }
  if (end <= start) {
    showError("출차 일시는 입차 일시보다 늦어야 합니다.");
    renderUnavailableState();
    return;
  }
  if (end - start > 365 * 24 * 60 * 60 * 1000) {
    showError("최대 365일까지 계산할 수 있어요.");
    renderUnavailableState();
    return;
  }
  if (!lot) {
    showError("선택한 차량이 이용할 수 있는 주차장이 없습니다.");
    renderUnavailableState();
    return;
  }

  clearError();
  const quotes = quoteAllLots(start, end, discount);
  const selectedQuote = quotes.find((quote) => quote.lot.id === lot.id);
  const recommended = chooseRecommendedQuote(quotes);
  const rule = lot.rates[vehicle.feeClass];
  const calculation = selectedQuote.calculation;
  const discountAmount = selectedQuote.discountAmount;
  const finalPrice = selectedQuote.finalPrice;
  const peakSegments = calculation.segments.filter((segment) => segment.peak).length;
  const duration = formatDuration(start, end);

  $("#final-price").textContent = finalPrice.toLocaleString("ko-KR");
  $("#duration-text").textContent = duration;
  $("#base-price").textContent = formatWon(calculation.total);
  $("#discount-label").textContent = discount.label;
  $("#discount-price").textContent = discountAmount ? `-${formatWon(discountAmount)}` : "0원";
  $("#result-summary").textContent = `${airport.name} ${lot.name}에서 ${duration} 주차하는 조건입니다.`;
  $("#selected-airport").textContent = `${airport.code} ${airport.name.replace("국제공항", "").replace("공항", "")}`;
  $("#selected-terminal").textContent = currentTerminal().label;
  $("#selected-lot").textContent = lot.name;
  $("#selected-vehicle").textContent = vehicle.feeClass === "small" ? "소형 요금" : "대형 요금";
  $("#official-source").href = airport.source;
  renderRecommendation(recommended, quotes);
  renderMap(quotes, recommended);
  renderComparison(quotes, recommended);

  const notes = [];
  if (rule.free) {
    notes.push(`${airport.name} ${lot.name}은 현재 무료로 안내되어 있습니다.`);
  } else {
    if (peakSegments && rule.peakMax !== rule.dailyMax) {
      notes.push(`금·토·일 또는 추가한 공휴일 요금 구간 ${peakSegments}개를 반영했습니다.`);
    }
    notes.push(discount.note);
    notes.push("현장 정책과 법정공휴일 지정에 따라 실제 금액이 달라질 수 있습니다.");
  }
  $("#calculation-note").textContent = notes.join(" ");
}

function renderHolidayList() {
  const container = $("#holiday-list");
  const dates = [...holidayDates].sort();
  container.innerHTML = dates.map((date) => (
    `<span class="ap-chip">${date}<button type="button" data-remove-holiday="${date}" aria-label="${date} 삭제">×</button></span>`
  )).join("");

  container.querySelectorAll("[data-remove-holiday]").forEach((button) => {
    button.addEventListener("click", () => {
      holidayDates.delete(button.dataset.removeHoliday);
      renderHolidayList();
      calculate();
    });
  });
}

function addHoliday() {
  if (!holidayInput.value) return;
  holidayDates.add(holidayInput.value);
  holidayInput.value = "";
  renderHolidayList();
  calculate();
}

function handleAirportChange() {
  updateTerminalOptions();
  updateLotOptions();
  calculate();
}

function handleVehicleChange() {
  updateVehicleClassification();
  updateLotOptions();
  calculate();
}

airportSelect.addEventListener("change", handleAirportChange);
terminalSelect.addEventListener("change", calculate);
lotSelect.addEventListener("change", calculate);
vehicleSelect.addEventListener("change", handleVehicleChange);
entryInput.addEventListener("change", calculate);
exitInput.addEventListener("change", calculate);
document.querySelectorAll('input[name="discount"]').forEach((input) => input.addEventListener("change", calculate));
$("#add-holiday").addEventListener("click", addHoliday);
$("#use-recommended").addEventListener("click", () => {
  if (recommendedLotId) selectLot(recommendedLotId);
});
holidayInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addHoliday();
  }
});

document.querySelectorAll("[data-days]").forEach((button) => {
  button.addEventListener("click", () => {
    const entry = new Date(entryInput.value);
    if (Number.isNaN(entry.getTime())) return;
    const exit = new Date(entry.getTime() + Number(button.dataset.days) * 24 * 60 * 60 * 1000);
    exitInput.value = toInputValue(exit);
    calculate();
  });
});

buildAirportOptions();
updateTerminalOptions();
setDefaultDates();
updateVehicleClassification();
updateLotOptions();
lotSelect.value = "long";
updateLotNote();
calculate();

})();
