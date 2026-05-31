// Final seating chart — source of truth is the couple's confirmed chart (June 2026).
// Dietary/meal details are intentionally NOT included here (kept private; catering-only).
// Reveal date: seating becomes visible to guests on June 10, 2026 (Hawaii time, UTC-10).

export const SEATING_REVEAL_ISO = '2026-06-10T00:00:00-10:00';

export const isSeatingLive = (): boolean => Date.now() >= Date.parse(SEATING_REVEAL_ISO);

export interface SeatGuest {
  name: string;
  note?: string;        // optional relationship label (family table only)
  aliases?: string[];   // alternate names / nicknames for search matching
}

export interface SeatTable {
  id: string;
  label: string;        // short label, e.g. "Table 1"
  theme: string;        // bilingual theme
  seats: SeatGuest[];
}

export const SEATING: SeatTable[] = [
  {
    id: 'sweetheart',
    label: 'Sweetheart Table',
    theme: 'Pili Aloha · 新人桌',
    seats: [
      { name: 'Yuwen Zhang', note: 'Bride', aliases: ['Wendy', 'Yuwen', '昱雯'] },
      { name: 'Xiaodong Yang', note: 'Groom', aliases: ['Francis', 'Xiaodong', '晓东'] },
    ],
  },
  {
    id: 't1',
    label: 'Table 1',
    theme: 'ʻOhana · 家人',
    seats: [
      { name: 'Chunling Mao', note: "Groom's Mom" },
      { name: 'Chunxi Su', note: "Bride's Mom" },
      { name: 'Zeli Zhang', note: "Junhuan's GF" },
      { name: 'Kaiyi Zhang' },
      { name: 'Junhuan Sun', note: "Bride's Brother" },
      { name: 'Yun Zhang', note: "Bride's Dad" },
      { name: 'Jianke Yang', note: "Groom's Dad" },
    ],
  },
  {
    id: 't2',
    label: 'Table 2',
    theme: 'Aloha Holoholona · 猫猫狗狗',
    seats: [
      { name: 'Xiaodan Chen' },
      { name: 'Xueer Lu' },
      { name: 'Yue Li' },
      { name: 'Rui Xia' },
      { name: 'Yijie Zhuang' },
      { name: 'Yuqing Wang' },
      { name: 'Siqi Fan' },
      { name: 'Mengda Liu' },
    ],
  },
  {
    id: 't3',
    label: 'Table 3',
    theme: 'Hoʻolauleʻa · 音乐节 / 火人节',
    seats: [
      { name: 'Xu Sun' },
      { name: 'Cai Song' },
      { name: 'Yiwen Wang' },
      { name: 'Allison' },
      { name: 'Yayuan Mo' },
      { name: 'Arnold Luk' },
      { name: 'Ziwei Li' },
      { name: 'Mike Jiang' },
    ],
  },
  {
    id: 't4',
    label: 'Table 4',
    theme: 'Hoa Wolverine · 电影 / 胶片 / 摄影',
    seats: [
      { name: 'Yang Yang' },
      { name: 'Yifei Bao' },
      { name: 'Zhihong Luo' },
      { name: 'Yichen Zhang' },
      { name: 'Yate Ji' },
      { name: 'Xinglin Wang' },
      { name: 'Jiongsheng Cai' },
      { name: 'Yurui Yang' },
    ],
  },
  {
    id: 't5',
    label: 'Table 5',
    theme: 'Nā ʻŌpio · Wendy 朋友圈',
    seats: [
      { name: 'Jiayu Zhang' },
      { name: 'Yichi Zhang' },
      { name: 'Kehan Bao' },
      { name: 'Zebang Li' },
      { name: 'Jingxi Huang' },
      { name: 'Qi Leng' },
      { name: 'Kyle Andelin' },
    ],
  },
  {
    id: 't6',
    label: 'Table 6',
    theme: 'Nā Mauna · 户外 / 滑雪',
    seats: [
      { name: 'Jiechao He' },
      { name: 'Ting Zhang' },
      { name: 'Jingyi Lin' },
      { name: 'Di Sun' },
      { name: 'Yichu Wang' },
      { name: 'Jiashan Song' },
      { name: 'Chenrui Zhou' },
      { name: 'Dongyang Li' },
    ],
  },
  {
    id: 't7',
    label: 'Table 7',
    theme: 'ʻOno · 美食',
    seats: [
      { name: 'Xinyue Geng' },
      { name: 'Jiayi Liu' },
      { name: 'Zhenbang Chen' },
      { name: 'Egan Zhang' },
      { name: 'Mengni Zhang' },
      { name: 'Yannie Lee' },
      { name: 'Yichao Zhao' },
      { name: 'Tianliang Lin' },
    ],
  },
  {
    id: 't8',
    label: 'Table 8',
    theme: 'Aloha Mua · 红酒 / 初代夏威夷',
    seats: [
      { name: 'Zhangchi Yao' },
      { name: 'Yueyi Ma' },
      { name: 'Xikai Chen' },
      { name: 'Zhixian Chen' },
      { name: 'Meshen Wu' },
      { name: 'Erica Huang' },
      { name: 'Xiaoke Chen' },
      { name: 'Yawei Zhang' },
    ],
  },
];

// Flatten for search: returns the matching table + the guest, or null.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9一-鿿]/g, '');

export interface SeatMatch {
  table: SeatTable;
  guest: SeatGuest;
}

export const findSeat = (query: string): SeatMatch[] => {
  const q = norm(query);
  if (q.length < 2) return [];
  const results: SeatMatch[] = [];
  for (const table of SEATING) {
    for (const guest of table.seats) {
      const candidates = [guest.name, ...(guest.aliases || [])].map(norm);
      const hit = candidates.some(c => c === q || c.includes(q) || q.includes(c));
      if (hit) results.push({ table, guest });
    }
  }
  return results;
};
