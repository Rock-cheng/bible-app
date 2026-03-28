// 圣经书卷元数据 - 开源和合本 (CUV)
export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  abbr: string;
  testament: 'OT' | 'NT';
  chapters: Chapter[];
}

export const BIBLE_BOOKS_META: Array<{
  id: string;
  name: string;
  abbr: string;
  testament: 'OT' | 'NT';
  chapterCount: number;
}> = [
  { id: 'GEN', name: '创世记', abbr: '创', testament: 'OT', chapterCount: 50 },
  { id: 'EXO', name: '出埃及记', abbr: '出', testament: 'OT', chapterCount: 40 },
  { id: 'LEV', name: '利未记', abbr: '利', testament: 'OT', chapterCount: 27 },
  { id: 'NUM', name: '民数记', abbr: '民', testament: 'OT', chapterCount: 36 },
  { id: 'DEU', name: '申命记', abbr: '申', testament: 'OT', chapterCount: 34 },
  { id: 'JOS', name: '约书亚记', abbr: '书', testament: 'OT', chapterCount: 24 },
  { id: 'JDG', name: '士师记', abbr: '士', testament: 'OT', chapterCount: 21 },
  { id: 'RUT', name: '路得记', abbr: '得', testament: 'OT', chapterCount: 4 },
  { id: '1SA', name: '撒母耳记上', abbr: '撒上', testament: 'OT', chapterCount: 31 },
  { id: '2SA', name: '撒母耳记下', abbr: '撒下', testament: 'OT', chapterCount: 24 },
  { id: '1KI', name: '列王纪上', abbr: '王上', testament: 'OT', chapterCount: 22 },
  { id: '2KI', name: '列王纪下', abbr: '王下', testament: 'OT', chapterCount: 25 },
  { id: '1CH', name: '历代志上', abbr: '代上', testament: 'OT', chapterCount: 29 },
  { id: '2CH', name: '历代志下', abbr: '代下', testament: 'OT', chapterCount: 36 },
  { id: 'EZR', name: '以斯拉记', abbr: '拉', testament: 'OT', chapterCount: 10 },
  { id: 'NEH', name: '尼希米记', abbr: '尼', testament: 'OT', chapterCount: 13 },
  { id: 'EST', name: '以斯帖记', abbr: '斯', testament: 'OT', chapterCount: 10 },
  { id: 'JOB', name: '约伯记', abbr: '伯', testament: 'OT', chapterCount: 42 },
  { id: 'PSA', name: '诗篇', abbr: '诗', testament: 'OT', chapterCount: 150 },
  { id: 'PRO', name: '箴言', abbr: '箴', testament: 'OT', chapterCount: 31 },
  { id: 'ECC', name: '传道书', abbr: '传', testament: 'OT', chapterCount: 12 },
  { id: 'SNG', name: '雅歌', abbr: '歌', testament: 'OT', chapterCount: 8 },
  { id: 'ISA', name: '以赛亚书', abbr: '赛', testament: 'OT', chapterCount: 66 },
  { id: 'JER', name: '耶利米书', abbr: '耶', testament: 'OT', chapterCount: 52 },
  { id: 'LAM', name: '耶利米哀歌', abbr: '哀', testament: 'OT', chapterCount: 5 },
  { id: 'EZK', name: '以西结书', abbr: '结', testament: 'OT', chapterCount: 48 },
  { id: 'DAN', name: '但以理书', abbr: '但', testament: 'OT', chapterCount: 12 },
  { id: 'HOS', name: '何西阿书', abbr: '何', testament: 'OT', chapterCount: 14 },
  { id: 'JOL', name: '约珥书', abbr: '珥', testament: 'OT', chapterCount: 3 },
  { id: 'AMO', name: '阿摩司书', abbr: '摩', testament: 'OT', chapterCount: 9 },
  { id: 'OBA', name: '俄巴底亚书', abbr: '俄', testament: 'OT', chapterCount: 1 },
  { id: 'JON', name: '约拿书', abbr: '拿', testament: 'OT', chapterCount: 4 },
  { id: 'MIC', name: '弥迦书', abbr: '弥', testament: 'OT', chapterCount: 7 },
  { id: 'NAM', name: '那鸿书', abbr: '鸿', testament: 'OT', chapterCount: 3 },
  { id: 'HAB', name: '哈巴谷书', abbr: '哈', testament: 'OT', chapterCount: 3 },
  { id: 'ZEP', name: '西番雅书', abbr: '番', testament: 'OT', chapterCount: 3 },
  { id: 'HAG', name: '哈该书', abbr: '该', testament: 'OT', chapterCount: 2 },
  { id: 'ZEC', name: '撒迦利亚书', abbr: '亚', testament: 'OT', chapterCount: 14 },
  { id: 'MAL', name: '玛拉基书', abbr: '玛', testament: 'OT', chapterCount: 4 },
  { id: 'MAT', name: '马太福音', abbr: '太', testament: 'NT', chapterCount: 28 },
  { id: 'MRK', name: '马可福音', abbr: '可', testament: 'NT', chapterCount: 16 },
  { id: 'LUK', name: '路加福音', abbr: '路', testament: 'NT', chapterCount: 24 },
  { id: 'JHN', name: '约翰福音', abbr: '约', testament: 'NT', chapterCount: 21 },
  { id: 'ACT', name: '使徒行传', abbr: '徒', testament: 'NT', chapterCount: 28 },
  { id: 'ROM', name: '罗马书', abbr: '罗', testament: 'NT', chapterCount: 16 },
  { id: '1CO', name: '哥林多前书', abbr: '林前', testament: 'NT', chapterCount: 16 },
  { id: '2CO', name: '哥林多后书', abbr: '林后', testament: 'NT', chapterCount: 13 },
  { id: 'GAL', name: '加拉太书', abbr: '加', testament: 'NT', chapterCount: 6 },
  { id: 'EPH', name: '以弗所书', abbr: '弗', testament: 'NT', chapterCount: 6 },
  { id: 'PHP', name: '腓立比书', abbr: '腓', testament: 'NT', chapterCount: 4 },
  { id: 'COL', name: '歌罗西书', abbr: '西', testament: 'NT', chapterCount: 4 },
  { id: '1TH', name: '帖撒罗尼迦前书', abbr: '帖前', testament: 'NT', chapterCount: 5 },
  { id: '2TH', name: '帖撒罗尼迦后书', abbr: '帖后', testament: 'NT', chapterCount: 3 },
  { id: '1TI', name: '提摩太前书', abbr: '提前', testament: 'NT', chapterCount: 6 },
  { id: '2TI', name: '提摩太后书', abbr: '提后', testament: 'NT', chapterCount: 4 },
  { id: 'TIT', name: '提多书', abbr: '多', testament: 'NT', chapterCount: 3 },
  { id: 'PHM', name: '腓利门书', abbr: '门', testament: 'NT', chapterCount: 1 },
  { id: 'HEB', name: '希伯来书', abbr: '来', testament: 'NT', chapterCount: 13 },
  { id: 'JAS', name: '雅各书', abbr: '雅', testament: 'NT', chapterCount: 5 },
  { id: '1PE', name: '彼得前书', abbr: '彼前', testament: 'NT', chapterCount: 5 },
  { id: '2PE', name: '彼得后书', abbr: '彼后', testament: 'NT', chapterCount: 3 },
  { id: '1JN', name: '约翰一书', abbr: '约一', testament: 'NT', chapterCount: 5 },
  { id: '2JN', name: '约翰二书', abbr: '约二', testament: 'NT', chapterCount: 1 },
  { id: '3JN', name: '约翰三书', abbr: '约三', testament: 'NT', chapterCount: 1 },
  { id: 'JUD', name: '犹大书', abbr: '犹', testament: 'NT', chapterCount: 1 },
  { id: 'REV', name: '启示录', abbr: '启', testament: 'NT', chapterCount: 22 },
];

// 每日经文数据
export const DAILY_VERSES = [
  { ref: '约翰福音 3:16', text: '神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生。' },
  { ref: '诗篇 23:1', text: '耶和华是我的牧者，我必不至缺乏。' },
  { ref: '腓立比书 4:13', text: '我靠着那加给我力量的，凡事都能做。' },
  { ref: '耶利米书 29:11', text: '耶和华说，我知道我向你们所怀的意念是赐平安的意念，不是降灾祸的意念，要叫你们末后有指望。' },
  { ref: '以赛亚书 40:31', text: '但那等候耶和华的必重新得力。他们必如鹰展翅上腾；他们奔跑却不困倦，行走却不疲乏。' },
  { ref: '马太福音 11:28', text: '凡劳苦担重担的人可以到我这里来，我就使你们得安息。' },
  { ref: '罗马书 8:28', text: '我们晓得万事都互相效力，叫爱神的人得益处，就是按他旨意被召的人。' },
  { ref: '约书亚记 1:9', text: '我岂没有吩咐你么？你当刚强壮胆，不要惧怕，也不要惊惶；因为你无论往哪里去，耶和华你的神必与你同在。' },
  { ref: '箴言 3:5-6', text: '你要专心仰赖耶和华，不可倚靠自己的聪明，在你一切所行的事上都要认定他，他必指引你的路。' },
  { ref: '哥林多前书 13:4', text: '爱是恒久忍耐，又有恩慈；爱是不嫉妒；爱是不自夸，不张狂。' },
];
