
export interface JpStation {
  name: string;
  region: string;
  address: string;
  lat: number;
  lng: number;
}

export const JP_STATIONS: JpStation[] = [
  // Hokkaido
  { name: '에베츠 (Ebetsu)', region: 'Hokkaido', address: '에베츠시 에베츠부토 / 시노츠 / 가쿠야 일대', lat: 43.106, lng: 141.560 },
  { name: '테이네 산 (Teine)', region: 'Hokkaido', address: '삿포로시 니시구 헤이와 439-1', lat: 43.076, lng: 141.200 },
  { name: '삿포로 오도리', region: 'Hokkaido', address: '삿포로시 주오구 기타1조니시 일대', lat: 43.061, lng: 141.354 },
  { name: '아시베츠 (Ashibetsu)', region: 'Hokkaido', address: '홋카이도 아시베츠시 호로나이 판케이 산', lat: 43.518, lng: 142.186 },
  { name: '유바리 (Yubari)', region: 'Hokkaido', address: '홋카이도 유바리시 고마츠 1 / 미나미시미즈와', lat: 42.923, lng: 141.972 },
  { name: '후카가와 (Fukagawa)', region: 'Hokkaido', address: '홋카이도 후카가와시 오사무나이초 토키와 산', lat: 43.721, lng: 142.041 },
  { name: '우타시나이 (Utashinai)', region: 'Hokkaido', address: '홋카이도 우타시나이시 나카무라 카모이다케 산', lat: 43.513, lng: 142.036 },
  { name: '니세코 (Niseko)', region: 'Hokkaido', address: '홋카이도 니세코초 니세코 510-1 카바야마 산', lat: 42.863, lng: 140.697 },
  { name: '미나미요테이', region: 'Hokkaido', address: '홋카이도 맛카리무라 미하라 군진 산', lat: 42.793, lng: 140.783 },
  { name: '이와나이 (Iwanai)', region: 'Hokkaido', address: '홋카이도 이와나이초 시키시마나이 725-1', lat: 42.984, lng: 140.513 },
  { name: '쿠로마츠나이', region: 'Hokkaido', address: '홋카이도 쿠로마츠나이초 이가라시 마루야마 산', lat: 42.668, lng: 140.306 },
  { name: '시마마키 (Shimamaki)', region: 'Hokkaido', address: '홋카이도 시마마키무라 토요오카 우타시마 고원', lat: 42.700, lng: 139.967 },
  { name: '토야 (Toya)', region: 'Hokkaido', address: '홋카이도 토야코초 하나와 4-30', lat: 42.550, lng: 140.833 },
  { name: '노보리베츠', region: 'Hokkaido', address: '홋카이도 노보리베츠시 노보리베츠온센초', lat: 42.493, lng: 141.144 },
  { name: '우라카와 (Urakawa)', region: 'Hokkaido', address: '홋카이도 우라카와초 쇼헤이초 / 이칸타이', lat: 42.167, lng: 142.767 },
  { name: '시즈나이 (Shizunai)', region: 'Hokkaido', address: '홋카이도 신히다카초 사사야마 산', lat: 42.333, lng: 142.367 },
  { name: '히다카 (Hidaka)', region: 'Hokkaido', address: '홋카이도 히다카초 치사카', lat: 42.875, lng: 142.441 },
  { name: '후레나이 (Furenai)', region: 'Hokkaido', address: '홋카이도 비라토리초 후레나이초', lat: 42.784, lng: 142.233 },
  { name: '하코다테야마', region: 'Hokkaido', address: '홋카이도 하코다테시 하코다테야마 고텐야마', lat: 41.758, lng: 140.704 },
  { name: '카메다 (Kameda)', region: 'Hokkaido', address: '홋카이도 하코다테시 토미오카초 3조메 21-1', lat: 41.808, lng: 140.758 },
  { name: '마츠마에 (Matsumae)', region: 'Hokkaido', address: '홋카이도 마츠마에초 타테이시 / 시라카미', lat: 41.429, lng: 140.114 },
  { name: '에사시 (Esashi)', region: 'Hokkaido', address: '홋카이도 에사시초 히노키타이 / 타자와초 / 후시키도초', lat: 41.867, lng: 140.128 },
  { name: '키타히야마', region: 'Hokkaido', address: '홋카이도 세타나초 키타히야마쿠니와', lat: 42.417, lng: 139.867 },
  { name: '이마카네 (Imakane)', region: 'Hokkaido', address: '홋카이도 이마카네초 카미오카 439-2', lat: 42.433, lng: 140.017 },
  { name: '나요로 (Nayoro)', region: 'Hokkaido', address: '홋카이도 나요로시 오하시 / 토나미 / 미도리오카', lat: 44.358, lng: 142.458 },
  { name: '후라노 (Furano)', region: 'Hokkaido', address: '홋카이도 나카후라노초 신타나카노조 호쿠세이 산', lat: 43.342, lng: 142.383 },
  { name: '카미카와 (Kamikawa)', region: 'Hokkaido', address: '홋카이도 카미카와초 코시지 에사우시 산', lat: 43.842, lng: 142.767 },
  { name: '엔베츠 (Enbets)', region: 'Hokkaido', address: '홋카이도 엔베츠초 후지미 / 키타하마', lat: 44.717, lng: 141.783 },
  { name: '하보로 (Haboro)', region: 'Hokkaido', address: '홋카이도 하보로초 아사히 627-1', lat: 44.358, lng: 141.708 },
  { name: '루모이 (Rumoi)', region: 'Hokkaido', address: '홋카이도 루모이시 오키미초 / 하마나카초 / 시오미초', lat: 43.942, lng: 141.650 },

  // Kanto & Chubu
  { name: '키사라즈 (Kisarazu)', region: 'Kanto & Chubu', address: '치바현 키사라즈시 츠바키 818', lat: 35.374, lng: 139.923 },
  { name: '쿠리히라 (Kurihira)', region: 'Kanto & Chubu', address: '사이타마현 쿠키시 쿠리히라', lat: 36.064, lng: 139.670 },
  { name: '도쿄 스카이트리', region: 'Kanto & Chubu', address: '도쿄도 스미다구 오시아게 1초메 1-2', lat: 35.710, lng: 139.810 },
  { name: '요다 (Yoda)', region: 'Kanto & Chubu', address: '사이타마현 토다시', lat: 35.818, lng: 139.678 },
  { name: '모리야 (Moriya)', region: 'Kanto & Chubu', address: '이바라키현 모리야시', lat: 35.952, lng: 139.975 },
  { name: '노노이치 (Nonoichi)', region: 'Kanto & Chubu', address: '이시카와현 노노이치시 오시노 / 이치모토초', lat: 36.533, lng: 136.600 },
  { name: '나나오 (Nanao)', region: 'Kanto & Chubu', address: '이시카와현 나나오시 고쿠분초 / 노토지마 스소초', lat: 37.042, lng: 136.967 },
  { name: '와지마 (Wajima)', region: 'Kanto & Chubu', address: '이시카와현 와지마시', lat: 37.391, lng: 136.903 },
  { name: '스즈 (Suzu)', region: 'Kanto & Chubu', address: '이시카와현 호주군 노토초 아케노', lat: 37.433, lng: 137.267 },
  { name: '야마나카 (Yamanaka)', region: 'Kanto & Chubu', address: '이시카와현 카가시 야마나카 온천 미나시 산', lat: 36.317, lng: 136.467 },
  { name: '오쿠히다 온천', region: 'Kanto & Chubu', address: '일본 기후현 다카야마시 오쿠히다', lat: 36.196, lng: 137.562 },

  // Kinki & Kyushu
  { name: '미하라 (Mihara)', region: 'Kinki & Kyushu', address: '오사카부 사카이시 미하라구 단카미 43', lat: 34.560, lng: 135.560 },
  { name: '하비키노 (Habikino)', region: 'Kinki & Kyushu', address: '오사카부 하비키노시 고즈 53번 3호', lat: 34.550, lng: 135.600 },
  { name: '다카이시 (Takaishi)', region: 'Kinki & Kyushu', address: '오사카부 다카이시시 아야조노 / 니시토리이시', lat: 34.520, lng: 135.430 },
  { name: '이코마산 (Ikoma)', region: 'Kinki & Kyushu', address: '오사카부 히가시오사카시 야마테초 2028', lat: 34.678, lng: 135.683 },
  { name: '오시오산 (Oshio)', region: 'Kinki & Kyushu', address: '교토부 교토시 니시쿄구', lat: 34.950, lng: 135.633 },
  { name: '후국오카 타워', region: 'Kinki & Kyushu', address: '후국오카현 후국오카시 사와라구 모모치하마', lat: 33.593, lng: 130.351 },
  { name: '사라쿠라산', region: 'Kinki & Kyushu', address: '후국오카현 기타큐슈시 야하타히가시구', lat: 33.842, lng: 130.806 },
  { name: '이토시마 (Itoshima)', region: 'Kinki & Kyushu', address: '후국오카현 이토시마시 시마미토코 943-2', lat: 33.567, lng: 130.183 },
  { name: '무나가타 (Munakata)', region: 'Kinki & Kyushu', address: '후국오카현 후국쓰시 야쓰나미 733', lat: 33.750, lng: 130.483 },
  { name: '유쿠하시 (Yukuhashi)', region: 'Kinki & Kyushu', address: '후국오카현 가와라마치 카가미야마 1352', lat: 33.717, lng: 130.983 },
  { name: '모지 (Moji)', region: 'Kinki & Kyushu', address: '후국오카현 기타큐슈시 모지구 쿠로가와 691-83', lat: 33.917, lng: 130.967 },
  { name: '치쿠젠야마다', region: 'Kinki & Kyushu', address: '후국오카현 가마시 쿠마가하타산', lat: 33.567, lng: 130.717 },
  { name: '오무타 (Omuta)', region: 'Kinki & Kyushu', address: '후국오카현 오무타시 니시신마치 16-2', lat: 33.030, lng: 130.450 },

  // Islands
  { name: '마쿠라자키', region: 'Islands', address: '가고시마현 마쿠라자키시 히가시카고 3648', lat: 31.267, lng: 130.300 },
  { name: '요론 (Yoron)', region: 'Islands', address: '가고시마현 요론초 자바나', lat: 27.050, lng: 128.433 },
  { name: '아마미스미요', region: 'Islands', address: '가고시마현 아마미시 스미요초 이시하라 다키노하나산', lat: 28.317, lng: 129.433 },
  { name: '구리오 (Kurio)', region: 'Islands', address: '가고시마현 야쿠시마초 구리오 2930-3', lat: 30.267, lng: 130.417 },
  { name: '다네가시마', region: 'Islands', address: '가고시마현 니시오모테시 후루타', lat: 30.600, lng: 130.983 },
  { name: '도쿠노시마', region: 'Islands', address: '가고시마현 도쿠노시마초 가메쓰 이노카와산 / 도쿠와세', lat: 27.800, lng: 129.017 },
  { name: '기카이 (Kikai)', region: 'Islands', address: '가고시마현 기카이초 가돈 햐쿠노다이', lat: 28.317, lng: 130.017 },
  { name: '아마미우켄', region: 'Islands', address: '가고시마현 우켄손 이케가치 미네타산', lat: 28.267, lng: 129.283 },
  { name: '아마미야마토', region: 'Islands', address: '가고시마현 야마토손 이마자토 손자키', lat: 28.350, lng: 129.350 },
  { name: '지나 (China)', region: 'Islands', address: '가고시마현 지나초 세리카쿠', lat: 27.367, lng: 128.567 },
  { name: '히가시이치키', region: 'Islands', address: '가고시마현 히오키시 히가시이치키초 토미반산', lat: 31.650, lng: 130.333 },
];
