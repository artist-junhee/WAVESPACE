
export interface KRStation {
  name: string;
  region: string;
  lat: number;
  lng: number;
  type: string;
}

export const KR_STATIONS: KRStation[] = [
  // 1. 수도권
  { name: "남양 송신소 (KBS)", region: "수도권", lat: 37.1994, lng: 126.7875, type: "AM/MW" },
  { name: "소래 송신소 (KBS)", region: "수도권", lat: 37.4552, lng: 126.7885, type: "AM/MW" },
  { name: "능곡 송신소 (CBS)", region: "수도권", lat: 37.6045, lng: 126.8208, type: "AM/MW" },
  { name: "당진 송신소 (KBS)", region: "수도권", lat: 36.9842, lng: 126.6342, type: "AM/SW" },
  { name: "화성 송신소 (KBS)", region: "수도권", lat: 37.1852, lng: 126.8342, type: "AM/MW" },
  { name: "김제 송신소 (KBS)", region: "수도권", lat: 35.8452, lng: 126.9242, type: "AM/SW" },
  { name: "대부도 송신소 (FEBC)", region: "수도권", lat: 37.2452, lng: 126.5842, type: "AM/MW" },
  { name: "관악산 송신소", region: "수도권", lat: 37.4442, lng: 126.9502, type: "TX SITE" },
  { name: "용문산 송신소", region: "수도권", lat: 37.5642, lng: 127.5942, type: "TX SITE" },
  { name: "남산 (N서울타워)", region: "수도권", lat: 37.5512, lng: 126.9882, type: "TX SITE" },
  { name: "수봉산 중계소", region: "수도권", lat: 37.4582, lng: 126.6812, type: "RELAY" },
  { name: "광교산 중계소", region: "수도권", lat: 37.3482, lng: 127.0312, type: "RELAY" },
  { name: "백령도 중계소", region: "수도권", lat: 37.9682, lng: 124.6412, type: "RELAY" },

  // 2. 강원권
  { name: "대룡산 송신소", region: "강원권", lat: 37.8682, lng: 127.8112, type: "TX SITE" },
  { name: "괘방산 송신소", region: "강원권", lat: 37.7182, lng: 129.0112, type: "TX SITE" },
  { name: "태기산 중계소", region: "강원권", lat: 37.5952, lng: 128.3242, type: "RELAY" },
  { name: "백운산 송신소", region: "강원권", lat: 37.2782, lng: 127.9512, type: "TX SITE" },
  { name: "경포 송신소", region: "강원권", lat: 37.7982, lng: 128.9112, type: "AM/MW" },
  { name: "함백산 중계소", region: "강원권", lat: 37.1582, lng: 128.8912, type: "RELAY" },

  // 3. 충청권
  { name: "식장산 송신소", region: "충청권", lat: 36.3212, lng: 127.4862, type: "TX SITE" },
  { name: "계룡산 송신소", region: "충청권", lat: 36.3532, lng: 127.2142, type: "TX SITE" },
  { name: "우암산 송신소", region: "충청권", lat: 36.6512, lng: 127.4982, type: "TX SITE" },
  { name: "가섭산 중계소", region: "충청권", lat: 36.9812, lng: 127.6582, type: "RELAY" },
  { name: "흑성산 중계소", region: "충청권", lat: 36.7812, lng: 127.2282, type: "RELAY" },
  { name: "원효봉 중계소", region: "충청권", lat: 36.7412, lng: 126.6282, type: "RELAY" },

  // 4. 전라권
  { name: "모악산 송신소", region: "전라권", lat: 35.8352, lng: 127.0422, type: "TX SITE" },
  { name: "무등산 송신소", region: "전라권", lat: 35.1332, lng: 127.0002, type: "TX SITE" },
  { name: "대둔산 중계소", region: "전라권", lat: 34.4632, lng: 126.6202, type: "RELAY" },
  { name: "양을산 중계소", region: "전라권", lat: 34.8132, lng: 126.3902, type: "RELAY" },
  { name: "구봉산 중계소", region: "전라권", lat: 34.7532, lng: 127.7102, type: "RELAY" },
  { name: "노고단 중계소", region: "전라권", lat: 35.2932, lng: 127.5302, type: "RELAY" },

  // 5. 경상권
  { name: "황령산 송신소", region: "경상권", lat: 35.1582, lng: 129.0812, type: "TX SITE" },
  { name: "팔공산 송신소", region: "경상권", lat: 36.0152, lng: 128.6942, type: "TX SITE" },
  { name: "무룡산 송신소", region: "경상권", lat: 35.5852, lng: 129.3942, type: "TX SITE" },
  { name: "불모산 송신소", region: "경상권", lat: 35.1552, lng: 128.7142, type: "TX SITE" },
  { name: "망진산 중계소", region: "경상권", lat: 35.1752, lng: 128.0742, type: "RELAY" },
  { name: "학가산 중계소", region: "경상권", lat: 36.6352, lng: 128.5342, type: "RELAY" },
  { name: "봉래산 중계소", region: "경상권", lat: 35.0852, lng: 129.0542, type: "RELAY" },

  // 6. 제주권
  { name: "견월악 송신소", region: "제주권", lat: 33.4442, lng: 126.6232, type: "TX SITE" },
  { name: "삼매봉 중계소", region: "제주권", lat: 33.2342, lng: 126.5532, type: "RELAY" },
  { name: "금악 중계소", region: "제주권", lat: 33.3542, lng: 126.2932, type: "RELAY" },
  { name: "광해악 중계소", region: "제주권", lat: 33.3242, lng: 126.3832, type: "RELAY" }
];
