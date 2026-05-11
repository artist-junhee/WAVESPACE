
export interface KRLowPowerStation {
  name: string;
  region: string;
  address: string;
  lat: number;
  lng: number;
  power?: string;
  freq?: string;
}

export const KR_LOW_POWER_STATIONS: KRLowPowerStation[] = [
  // 수도권 및 강원
  { name: '관악FM', region: 'Seoul, Gyeonggi & Gangwon', address: '서울특별시 관악구 신림로 141 (신림동 1514-1)', lat: 37.472, lng: 126.932 },
  { name: '마포공동체라디오', region: 'Seoul, Gyeonggi & Gangwon', address: '서울특별시 마포구 토정로 186 (창전동 436-12)', lat: 37.545, lng: 126.924 },
  { name: '서대문공동체라디오', region: 'Seoul, Gyeonggi & Gangwon', address: '서울 서대문구 백련사길 39 (홍은동 산26-155, 서대문문화체육회관)', lat: 37.584, lng: 126.936 },
  { name: '성남FM', region: 'Seoul, Gyeonggi & Gangwon', address: '경기 성남시 분당구 분당로 50 (수내동 1, 분당구청)', lat: 37.382, lng: 127.126 },
  { name: 'GO구리FM', region: 'Seoul, Gyeonggi & Gangwon', address: '경기도 구리시 일원', lat: 37.594, lng: 127.143 },
  { name: '수원공동체라디오', region: 'Seoul, Gyeonggi & Gangwon', address: '경기도 수원시 일원', lat: 37.263, lng: 127.028 },
  { name: '화성FM', region: 'Seoul, Gyeonggi & Gangwon', address: '경기도 화성시 일원', lat: 37.199, lng: 126.831 },
  { name: '단원FM', region: 'Seoul, Gyeonggi & Gangwon', address: '경기 안산시 단원구 원선로 50 (원곡동 828-5, 벽산블루밍아파트)', lat: 37.332, lng: 126.804 },
  { name: '인천FM', region: 'Seoul, Gyeonggi & Gangwon', address: '인천광역시 서구 일원', lat: 37.545, lng: 126.673 },
  { name: '연수공동체FM', region: 'Seoul, Gyeonggi & Gangwon', address: '인천광역시 연수구 일원', lat: 37.409, lng: 126.678 },
  { name: '영월FM공동체라디오', region: 'Seoul, Gyeonggi & Gangwon', address: '강원특별자치도 영월군 일원', lat: 37.183, lng: 128.467 },
  { name: '공동체라디오태백FM', region: 'Seoul, Gyeonggi & Gangwon', address: '강원특별자치도 태백시 일원', lat: 37.174, lng: 128.986 },
  { name: '용인 중계소', region: 'Seoul, Gyeonggi & Gangwon', address: '경기 용인시 처인구 역북동 산3-1', lat: 37.234, lng: 127.202, power: '0.02kW' },
  { name: '안성 중계소', region: 'Seoul, Gyeonggi & Gangwon', address: '경기 안성시 당왕동 산26 (비봉산)', lat: 37.018, lng: 127.279, power: '0.1kW' },
  { name: '진촌 중계소', region: 'Seoul, Gyeonggi & Gangwon', address: '인천 옹진군 백령면 북포리 산138-3 (업죽산)', lat: 37.962, lng: 124.647, power: '0.1kW' },
  { name: '성남 중계소', region: 'Seoul, Gyeonggi & Gangwon', address: '경기 성남시 중원구 은행2동 산2-2 (검단산)', lat: 37.447, lng: 127.171, power: '20W~100W' },

  // 충청 및 세종
  { name: '세종FM', region: 'Chungcheong & Sejong', address: '세종특별자치시 일원', lat: 36.480, lng: 127.289 },
  { name: '금강FM', region: 'Chungcheong & Sejong', address: '충청남도 공주시, 세종시 일원', lat: 36.446, lng: 127.118 },
  { name: '옥천FM', region: 'Chungcheong & Sejong', address: '충청북도 옥천군 일원', lat: 36.307, lng: 127.568 },
  { name: '대전생활문화방송', region: 'Chungcheong & Sejong', address: '대전광역시 서구 일원', lat: 36.350, lng: 127.384 },
  { name: '원효봉 중계소', region: 'Chungcheong & Sejong', address: '충남 서산시 해미면 원효봉길', lat: 36.741, lng: 126.628, power: '0.25kW' },

  // 경상
  { name: '성서공동체FM', region: 'Gyeongsang', address: '대구광역시 달서구 일원', lat: 35.852, lng: 128.513 },
  { name: '대구동구FM', region: 'Gyeongsang', address: '대구광역시 동구 일원', lat: 35.885, lng: 128.636 },
  { name: '와글사회적협동조합', region: 'Gyeongsang', address: '대구광역시 동구 일원', lat: 35.8852, lng: 128.6362 },
  { name: '영주FM', region: 'Gyeongsang', address: '경상북도 영주시 일원', lat: 36.808, lng: 128.625 },
  { name: '성주FM', region: 'Gyeongsang', address: '경상북도 성주군 일원', lat: 35.919, lng: 128.283 },
  { name: '한국문화나눔(상주)', region: 'Gyeongsang', address: '경상북도 상주시 일원', lat: 36.410, lng: 128.158 },
  { name: '남해FM', region: 'Gyeongsang', address: '경남도 남해군 일원', lat: 34.837, lng: 127.892 },
  { name: '연제FM', region: 'Gyeongsang', address: '부산광역시 연제구 일원', lat: 35.176, lng: 129.079 },

  // 전라 및 제주
  { name: '광주시민방송', region: 'Jeolla & Jeju', address: '광주광역시 북구 자미로 66번길 15', lat: 35.173, lng: 126.906 },
  { name: 'GBS 고려방송', region: 'Jeolla & Jeju', address: '광주광역시 광산구 일원', lat: 35.147, lng: 126.811, freq: '93.5MHz' },
  { name: '순천미디어네트워크', region: 'Jeolla & Jeju', address: '전라남도 순천시 일원', lat: 34.950, lng: 127.487 },
  { name: '전주공동체라디오', region: 'Jeolla & Jeju', address: '전북특별자치도 전주시 일원', lat: 35.824, lng: 127.148 },
  { name: '제주시티FM', region: 'Jeolla & Jeju', address: '제주특별자치도 제주시 일원', lat: 33.500, lng: 126.531 },

  // 기타 특수 중계소
  { name: 'Casey 중계소', region: 'AFN/Military Relay', address: '경기 동두천시 보산동', lat: 37.904, lng: 127.054, power: '0.1kW' },
  { name: 'Humphreys 중계소', region: 'AFN/Military Relay', address: '경기 평택시 팽성읍 송화리', lat: 36.966, lng: 127.051, power: '0.1kW' },
  { name: 'RedCloud 중계소', region: 'AFN/Military Relay', address: '경기 의정부시 가능동', lat: 37.749, lng: 127.031, power: '0.1kW' },
  { name: '오산공항 중계소', region: 'AFN/Military Relay', address: '경기 평택시 신장동', lat: 37.081, lng: 127.050, power: '0.03kW' }
];
