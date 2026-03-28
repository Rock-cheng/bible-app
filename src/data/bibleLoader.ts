import { BIBLE_BOOKS_META } from './bibleMeta';

export interface VerseData {
  verse: number;
  text: string;
}

export interface ChapterData {
  chapter: number;
  verses: VerseData[];
}

// 内嵌关键章节数据（创世记1章、约翰福音3章、诗篇23篇 等常用章节，保证离线可用）
const BUILTIN_DATA: Record<string, Record<number, VerseData[]>> = {
  GEN: {
    1: [
      { verse: 1, text: '起初，神创造天地。' },
      { verse: 2, text: '地是空虚混沌，渊面黑暗；神的灵运行在水面上。' },
      { verse: 3, text: '神说：「要有光」，就有了光。' },
      { verse: 4, text: '神看光是好的，就把光暗分开了。' },
      { verse: 5, text: '神称光为「昼」，称暗为「夜」。有晚上，有早晨，这是头一日。' },
      { verse: 6, text: '神说：「诸水之间要有空气，将水分为上下。」' },
      { verse: 7, text: '神就造出空气，将空气以下的水、空气以上的水分开了。事就这样成了。' },
      { verse: 8, text: '神称空气为「天」。有晚上，有早晨，是第二日。' },
      { verse: 9, text: '神说：「天下的水要聚在一处，使旱地露出来。」事就这样成了。' },
      { verse: 10, text: '神称旱地为「地」，称水的聚处为「海」。神看着是好的。' },
      { verse: 11, text: '神说：「地要发生青草和结种子的菜蔬，并结果子的树木，各从其类，果子都包着核。」事就这样成了。' },
      { verse: 12, text: '于是地发生了青草和结种子的菜蔬，各从其类；并结果子的树木，各从其类，果子都包着核。神看着是好的。' },
      { verse: 13, text: '有晚上，有早晨，是第三日。' },
      { verse: 14, text: '神说：「天上要有光体，可以分昼夜，作记号，定节令、日子、年岁，' },
      { verse: 15, text: '并要发光在天空，普照在地上。」事就这样成了。' },
      { verse: 16, text: '于是神造了两个大光，大的管昼，小的管夜，又造众星，' },
      { verse: 17, text: '就把这些光摆列在天空，普照在地上，' },
      { verse: 18, text: '管理昼夜，分别明暗。神看着是好的。' },
      { verse: 19, text: '有晚上，有早晨，是第四日。' },
      { verse: 20, text: '神说：「水要多多滋生有生命的物；要有雀鸟飞在地面以上、天空之中。」' },
      { verse: 21, text: '神就造出大鱼和水中所滋生各样有生命的动物，各从其类；又造出各样飞鸟，各从其类。神看着是好的。' },
      { verse: 22, text: '神就赐福给这一切，说：「滋生繁多，充满海中的水；雀鸟也要多生在地上。」' },
      { verse: 23, text: '有晚上，有早晨，是第五日。' },
      { verse: 24, text: '神说：「地要生出活物来，各从其类；牲畜、昆虫、野兽，各从其类。」事就这样成了。' },
      { verse: 25, text: '于是神造出野兽，各从其类；牲畜，各从其类；地上一切昆虫，各从其类。神看着是好的。' },
      { verse: 26, text: '神说：「我们要照着我们的形像、按着我们的样式造人，使他们管理海里的鱼、空中的鸟、地上的牲畜，和全地，并地上所爬的一切昆虫。」' },
      { verse: 27, text: '神就照着自己的形像造人，乃是照着他的形像造男造女。' },
      { verse: 28, text: '神就赐福给他们，又对他们说：「要生养众多，遍满地面，治理这地；也要管理海里的鱼、空中的鸟，和地上各样行动的活物。」' },
      { verse: 29, text: '神说：「看哪，我将遍地上一切结种子的菜蔬和一切树上所结有核的果子全赐给你们做食物。' },
      { verse: 30, text: '至于地上的走兽和空中的飞鸟，并各样爬在地上有生命的物，我将青草赐给它们做食物。」事就这样成了。' },
      { verse: 31, text: '神看着一切所造的都甚好。有晚上，有早晨，是第六日。' },
    ],
  },
  PSA: {
    23: [
      { verse: 1, text: '耶和华是我的牧者，我必不至缺乏。' },
      { verse: 2, text: '他使我躺卧在青草地上，领我在可安歇的水边。' },
      { verse: 3, text: '他使我的灵魂苏醒，为自己的名引导我走义路。' },
      { verse: 4, text: '我虽然行过死荫的幽谷，也不怕遭害，因为你与我同在；你的杖，你的竿，都安慰我。' },
      { verse: 5, text: '在我敌人面前，你为我摆设筵席；你用油膏了我的头，使我的福杯满溢。' },
      { verse: 6, text: '我一生一世必有恩惠慈爱随着我；我且要住在耶和华的殿中，直到永远。' },
    ],
    1: [
      { verse: 1, text: '不从恶人的计谋，不站罪人的道路，不坐亵慢人的座位，' },
      { verse: 2, text: '惟喜爱耶和华的律法，昼夜思想，这人便为有福！' },
      { verse: 3, text: '他要像一棵树栽在溪水旁，按时候结果子，叶子也不枯干。凡他所做的尽都顺利。' },
      { verse: 4, text: '恶人并不是这样，乃是像糠秕被风吹散。' },
      { verse: 5, text: '因此，当审判的时候恶人必站立不住；罪人在义人的会中也是如此。' },
      { verse: 6, text: '因为耶和华知道义人的道路；恶人的道路却必灭亡。' },
    ],
  },
  JHN: {
    3: [
      { verse: 1, text: '有一个法利赛人，名叫尼哥底母，是犹太人的官。' },
      { verse: 2, text: '这人夜里来见耶稣，说：「拉比，我们知道你是由神那里来作师傅的；因为你所行的神迹，若没有神同在，无人能行。」' },
      { verse: 3, text: '耶稣回答说：「我实实在在地告诉你，人若不重生，就不能见神的国。」' },
      { verse: 4, text: '尼哥底母说：「人已经老了，如何能重生呢？岂能再进母腹生出来吗？」' },
      { verse: 5, text: '耶稣说：「我实实在在地告诉你，人若不是从水和圣灵生的，就不能进神的国。' },
      { verse: 6, text: '从肉身生的就是肉身；从灵生的就是灵。' },
      { verse: 7, text: '我说你们必须重生，你不要以为希奇。' },
      { verse: 8, text: '风随着意思吹，你听见风的响声，却不晓得从哪里来，往哪里去；凡从圣灵生的，也是如此。」' },
      { verse: 9, text: '尼哥底母问他说：「怎能有这事呢？」' },
      { verse: 10, text: '耶稣回答说：「你是以色列人的先生，还不明白这事吗？' },
      { verse: 11, text: '我实实在在地告诉你，我们所说的是我们知道的；我们所见证的是我们见过的；你们却不领受我们的见证。' },
      { verse: 12, text: '我对你们说地上的事，你们尚且不信，若说天上的事，如何能信呢？' },
      { verse: 13, text: '除了从天降下、仍旧在天的人子，没有人升过天。' },
      { verse: 14, text: '摩西在旷野怎样举蛇，人子也必照样被举起来，' },
      { verse: 15, text: '叫一切信他的都得永生。' },
      { verse: 16, text: '「神爱世人，甚至将他的独生子赐给他们，叫一切信他的，不至灭亡，反得永生。' },
      { verse: 17, text: '因为神差他的儿子降世，不是要定世人的罪，乃是要叫世人因他得救。' },
      { verse: 18, text: '信他的人，不被定罪；不信的人，罪已经定了，因为他不信神独生子的名。' },
      { verse: 19, text: '光来到世间，世人因自己的行为是恶的，不爱光倒爱黑暗，定他们的罪就是在此。' },
      { verse: 20, text: '凡作恶的便恨光，并不来就光，恐怕他的行为受责备。' },
      { verse: 21, text: '但行真理的必来就光，要显明他所行的是靠神而行。」' },
    ],
    1: [
      { verse: 1, text: '太初有道，道与神同在，道就是神。' },
      { verse: 2, text: '这道太初与神同在。' },
      { verse: 3, text: '万物是藉着他造的；凡被造的，没有一样不是藉着他造的。' },
      { verse: 4, text: '生命在他里头，这生命就是人的光。' },
      { verse: 5, text: '光照在黑暗里，黑暗却不接受光。' },
      { verse: 6, text: '有一个人，是从神那里差来的，名叫约翰。' },
      { verse: 7, text: '这人来，为要作见证，就是为光作见证，叫众人因他可以信。' },
      { verse: 8, text: '他不是那光，乃是为那光作见证的。' },
      { verse: 9, text: '那光是真光，照亮一切生在世上的人。' },
      { verse: 10, text: '他在世界，世界也是藉着他造的，世界却不认识他。' },
      { verse: 11, text: '他到自己的地方来，自己的人倒不接待他。' },
      { verse: 12, text: '凡接待他的，就是信他名的人，他就赐他们权柄，作神的儿女。' },
      { verse: 13, text: '这等人不是从血气生的，不是从情欲生的，也不是从人意生的，乃是从神生的。' },
      { verse: 14, text: '道成了肉身，住在我们中间，充充满满的有恩典有真理。我们也见过他的荣光，正是父独生子的荣光。' },
    ],
  },
  MAT: {
    5: [
      { verse: 1, text: '耶稣看见这许多的人，就上了山，既已坐下，门徒到他跟前来，' },
      { verse: 2, text: '他就开口教训他们，说：' },
      { verse: 3, text: '「虚心的人有福了！因为天国是他们的。' },
      { verse: 4, text: '哀恸的人有福了！因为他们必得安慰。' },
      { verse: 5, text: '温柔的人有福了！因为他们必承受地土。' },
      { verse: 6, text: '饥渴慕义的人有福了！因为他们必得饱足。' },
      { verse: 7, text: '怜恤人的人有福了！因为他们必蒙怜恤。' },
      { verse: 8, text: '清心的人有福了！因为他们必得见神。' },
      { verse: 9, text: '使人和睦的人有福了！因为他们必称为神的儿子。' },
      { verse: 10, text: '为义受逼迫的人有福了！因为天国是他们的。' },
      { verse: 11, text: '人若因我辱骂你们，逼迫你们，捏造各样坏话毁谤你们，你们就有福了！' },
      { verse: 12, text: '应当欢喜快乐，因为你们在天上的赏赐是大的。在你们以前的先知，人也是这样逼迫他们。' },
    ],
    6: [
      { verse: 9, text: '所以，你们祷告要这样说：我们在天上的父，愿人都尊你的名为圣。' },
      { verse: 10, text: '愿你的国降临；愿你的旨意行在地上，如同行在天上。' },
      { verse: 11, text: '我们日用的饮食，今日赐给我们。' },
      { verse: 12, text: '免我们的债，如同我们免了人的债。' },
      { verse: 13, text: '不叫我们遇见试探；救我们脱离凶恶。因为国度、权柄、荣耀，全是你的，直到永远。阿们！' },
    ],
  },
  ROM: {
    8: [
      { verse: 1, text: '如今，那些在基督耶稣里的就不定罪了。' },
      { verse: 2, text: '因为赐生命圣灵的律，在基督耶稣里释放了我，使我脱离罪和死的律了。' },
      { verse: 28, text: '我们晓得万事都互相效力，叫爱神的人得益处，就是按他旨意被召的人。' },
      { verse: 38, text: '因为我深信无论是死，是生，是天使，是掌权的，是有能的，是现在的事，是将来的事，' },
      { verse: 39, text: '是高处的，是低处的，是别的受造之物，都不能叫我们与神的爱隔绝；这爱是在我们的主基督耶稣里的。' },
    ],
  },
  PHP: {
    4: [
      { verse: 4, text: '你们要靠主常常喜乐。我再说，你们要喜乐。' },
      { verse: 6, text: '应当一无挂虑，只要凡事藉着祷告、祈求，和感谢，将你们所要的告诉神。' },
      { verse: 7, text: '神所赐出人意外的平安必在基督耶稣里保守你们的心怀意念。' },
      { verse: 8, text: '弟兄们，那些真实的、可敬的、公义的、清洁的、可爱的、有美名的事；若有什么德行，若有什么称赞，这些事你们都要思念。' },
      { verse: 13, text: '我靠着那加给我力量的，凡事都能做。' },
    ],
  },
};

// 缓存已加载的章节数据
const chapterCache = new Map<string, VerseData[]>();

function getCacheKey(bookId: string, chapter: number): string {
  return `${bookId}_${chapter}`;
}

// 获取章节数据（优先内嵌数据，否则生成占位数据）
export async function getChapterData(bookId: string, chapterNum: number): Promise<VerseData[]> {
  const key = getCacheKey(bookId, chapterNum);
  
  // 检查缓存
  if (chapterCache.has(key)) {
    return chapterCache.get(key)!;
  }

  // 检查内嵌数据
  const builtinBook = BUILTIN_DATA[bookId];
  if (builtinBook && builtinBook[chapterNum]) {
    const data = builtinBook[chapterNum];
    chapterCache.set(key, data);
    return data;
  }

  // 检查 localStorage 缓存
  try {
    const stored = localStorage.getItem(`bible_${key}`);
    if (stored) {
      const data = JSON.parse(stored) as VerseData[];
      chapterCache.set(key, data);
      return data;
    }
  } catch {
    // 忽略解析错误
  }

  // 尝试从 bible-api.com 获取（公开免费API）
  try {
    const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
    if (book) {
      // 使用 bolls.life API - 支持中文 CUV
      const abbr = getBollsAbbr(bookId);
      const response = await fetch(
        `https://bolls.life/get-chapter/CUV/${abbr}/${chapterNum}/`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const verses: VerseData[] = data.map((v: { verse: number; text: string }) => ({
            verse: v.verse,
            text: v.text.replace(/<[^>]+>/g, ''),
          }));
          chapterCache.set(key, verses);
          // 缓存到 localStorage
          try {
            localStorage.setItem(`bible_${key}`, JSON.stringify(verses));
          } catch {
            // 存储空间不足时忽略
          }
          return verses;
        }
      }
    }
  } catch {
    // 网络不可用，使用占位数据
  }

  // 占位数据（离线降级）
  const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
  const placeholder = generatePlaceholder(book?.name || bookId, chapterNum);
  chapterCache.set(key, placeholder);
  return placeholder;
}

function generatePlaceholder(bookName: string, chapter: number): VerseData[] {
  return [
    { verse: 1, text: `${bookName} 第${chapter}章 — 正在加载，请连接网络后重试。` },
    { verse: 2, text: '此章节数据尚未缓存，联网后将自动下载。' },
  ];
}

// Bolls.life API 书卷编号映射
const BOLLS_ABBR_MAP: Record<string, number> = {
  GEN: 1, EXO: 2, LEV: 3, NUM: 4, DEU: 5, JOS: 6, JDG: 7, RUT: 8,
  '1SA': 9, '2SA': 10, '1KI': 11, '2KI': 12, '1CH': 13, '2CH': 14,
  EZR: 15, NEH: 16, EST: 17, JOB: 18, PSA: 19, PRO: 20, ECC: 21,
  SNG: 22, ISA: 23, JER: 24, LAM: 25, EZK: 26, DAN: 27, HOS: 28,
  JOL: 29, AMO: 30, OBA: 31, JON: 32, MIC: 33, NAM: 34, HAB: 35,
  ZEP: 36, HAG: 37, ZEC: 38, MAL: 39, MAT: 40, MRK: 41, LUK: 42,
  JHN: 43, ACT: 44, ROM: 45, '1CO': 46, '2CO': 47, GAL: 48, EPH: 49,
  PHP: 50, COL: 51, '1TH': 52, '2TH': 53, '1TI': 54, '2TI': 55,
  TIT: 56, PHM: 57, HEB: 58, JAS: 59, '1PE': 60, '2PE': 61,
  '1JN': 62, '2JN': 63, '3JN': 64, JUD: 65, REV: 66,
};

function getBollsAbbr(bookId: string): number {
  return BOLLS_ABBR_MAP[bookId] || 1;
}

// 简单全文搜索（在已缓存数据中搜索）
export interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export async function searchVerses(query: string, limit = 50): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  const q = query.trim().toLowerCase();

  // 搜索内嵌数据
  for (const [bookId, chapters] of Object.entries(BUILTIN_DATA)) {
    const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
    if (!book) continue;
    for (const [chapterStr, verses] of Object.entries(chapters)) {
      for (const verse of verses) {
        if (verse.text.includes(q) || verse.text.toLowerCase().includes(q)) {
          results.push({
            bookId,
            bookName: book.name,
            chapter: parseInt(chapterStr),
            verse: verse.verse,
            text: verse.text,
          });
          if (results.length >= limit) return results;
        }
      }
    }
  }

  // 搜索 localStorage 缓存
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('bible_')) continue;
    try {
      const [, bookId, chapterStr] = key.split('_');
      const verses = JSON.parse(localStorage.getItem(key)!) as VerseData[];
      const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
      if (!book) continue;
      for (const verse of verses) {
        if (verse.text.includes(q) || verse.text.toLowerCase().includes(q)) {
          results.push({
            bookId,
            bookName: book.name,
            chapter: parseInt(chapterStr),
            verse: verse.verse,
            text: verse.text,
          });
          if (results.length >= limit) return results;
        }
      }
    } catch {
      // 忽略
    }
  }

  return results;
}
