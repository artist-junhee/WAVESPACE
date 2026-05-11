
export interface ShortwaveStation {
  name: string;
  country: string;
  category: 'domestic' | 'overseas';
  address: string;
  lat: number;
  lng: number;
}

export const SHORTWAVE_STATIONS: ShortwaveStation[] = [
  // Domestic (Korea)
  {
    name: '김제 송신소',
    country: '대한민국',
    category: 'domestic',
    address: '전북 김제시 신곡2길 35-88 (신곡동 338-1)',
    lat: 35.836,
    lng: 126.923
  },
  {
    name: '화성 송신소',
    country: '대한민국',
    category: 'domestic',
    address: '경기 화성시 마도면 두곡리 113',
    lat: 37.202,
    lng: 126.791
  },
  {
    name: '고양 송신소',
    country: '대한민국',
    category: 'domestic',
    address: '경기 고양시 덕양구 일대',
    lat: 37.614,
    lng: 126.832
  },
  {
    name: '노원 송신소',
    country: '대한민국',
    category: 'domestic',
    address: '서울특별시 노원구 일대',
    lat: 37.625,
    lng: 127.070
  },
  {
    name: '대전 송신소',
    country: '대한민국',
    category: 'domestic',
    address: '대전광역시 유성구 가정로 267 (한국표준과학연구원)',
    lat: 36.388,
    lng: 127.374
  },
  {
    name: '김천 송신소',
    country: '대한민국',
    category: 'domestic',
    address: '경상북도 김천시 혁신8로 147-50 (기상청기상통신소)',
    lat: 36.126,
    lng: 128.188
  },
  // Overseas - Japan
  {
    name: '야마타 (Yamata) 송신소',
    country: '일본 (Japan)',
    category: 'overseas',
    address: '일본 이바라키현 고가시 아자야마타 4428 (KDDI)',
    lat: 36.175,
    lng: 139.850
  },
  {
    name: '네무로 (Nemuro) 송신소',
    country: '일본 (Japan)',
    category: 'overseas',
    address: '일본 홋카이도 네무로시 히가시와다 261',
    lat: 43.333,
    lng: 145.583
  },
  {
    name: '나가라 (Nagara) 송신소',
    country: '일본 (Japan)',
    category: 'overseas',
    address: '일본 치바현 쵸세이군 나가라마치 야마노고 31',
    lat: 35.483,
    lng: 140.233
  },
  // Overseas - Taiwan
  {
    name: '단수이 (Tamsui) 송신소',
    country: '대만 (Taiwan)',
    category: 'overseas',
    address: '대만 신베이시 단수이구 중정로2단 55-1호',
    lat: 25.176,
    lng: 121.442
  },
  {
    name: '바오중 (Baozhong) 송신소',
    country: '대만 (Taiwan)',
    category: 'overseas',
    address: '대만 윈린현 바오중향',
    lat: 23.708,
    lng: 120.313
  },
  // Overseas - Others
  {
    name: '타슈켄트 (Tashkent) 송신소',
    country: '우즈베키스탄',
    category: 'overseas',
    address: '우즈베키스탄 타슈켄트주',
    lat: 41.311,
    lng: 69.279
  },
  {
    name: '베이징 (Beijing) 송신소',
    country: '중국',
    category: 'overseas',
    address: '중국 베이징시 팡산구',
    lat: 39.904,
    lng: 116.407
  },
  {
    name: '우퍼턴 (Woofferton) 송신소',
    country: '영국',
    category: 'overseas',
    address: '영국 잉글랜드 웨스트미들랜즈 슈롭셔주 우퍼턴',
    lat: 52.316,
    lng: -2.716
  },
  {
    name: '이쑤덩 (Issoudun) 송신소',
    country: '프랑스',
    category: 'overseas',
    address: '프랑스 상트르발드루아르 앵드르주 이쑤덩',
    lat: 46.940,
    lng: 1.990
  },
  {
    name: '그린빌 (Greenville) 송신소',
    country: '미국',
    category: 'overseas',
    address: '미국 노스캐롤라이나주 피트군 그린빌',
    lat: 35.500,
    lng: -77.300
  }
];
