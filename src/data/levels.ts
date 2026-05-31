import { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    stage: 1,
    title: {
      en: "Stage 1: Home Row Basics",
      zh: "第 1 关：基准键练习"
    },
    description: {
      en: "Learn the home position: a s d f and j k l ;",
      zh: "学习基本位置：a s d f 和 j k l ;"
    },
    content: ["a", "s", "d", "f", "j", "k", "l", ";", "as", "df", "jk", "l;", "fad", "dad", "sad", "lass", "fall", "flask", "salad"]
  },
  {
    id: 2,
    stage: 2,
    title: {
      en: "Stage 2: Reach up & down (Index/Middle)",
      zh: "第 2 关：食指与中指的扩展"
    },
    description: {
      en: "Stretch to e r t y u i and c v m ,",
      zh: "练习上下移动：e r t y u i 和 c v m ,"
    },
    content: ["e", "r", "t", "y", "u", "i", "c", "v", "m", ",", "cat", "cut", "mud", "red", "true", "mice", "rice", "yum", "mum"]
  },
  {
    id: 3,
    stage: 3,
    title: {
      en: "Stage 3: The Outer Reaches (Ring/Pinky)",
      zh: "第 3 关：无名指与小指的挑战"
    },
    description: {
      en: "Reach for w q o p and x z . /",
      zh: "伸展手指：w q o p 和 x z . /"
    },
    content: ["w", "q", "o", "p", "x", "z", ".", "/", "box", "zoo", "pop", "wow", "cow", "quiz", "zero", "polo", "slow", "map."]
  },
  {
    id: 4,
    stage: 4,
    title: {
      en: "Stage 4: Animal Words",
      zh: "第 4 关：动物单词"
    },
    description: {
      en: "Type full words and practice your skills",
      zh: "输入完整的英文单词，巩固练习"
    },
    content: ["cat", "dog", "bird", "fish", "bear", "lion", "tiger", "zebra", "horse", "sheep"]
  },
  {
    id: 5,
    stage: 5,
    title: {
      en: "Stage 5: Nature Words",
      zh: "第 5 关：自然与天气"
    },
    description: {
      en: "Practice typing more words to build speed",
      zh: "练习更多全小写单词，提升打字速度"
    },
    content: ["sun", "moon", "star", "tree", "leaf", "wind", "rain", "snow", "cloud", "water"]
  },
  {
    id: 6,
    stage: 6,
    title: {
      en: "Stage 6: Capital Letters",
      zh: "第 6 关：大写字母"
    },
    description: {
      en: "Use the Shift keys to make capital letters",
      zh: "使用 Shift 键来输入大写字母"
    },
    content: ["Apple", "Banana", "Cherry", "Dog", "Elephant", "Frog", "A", "b", "C", "Dog"]
  },
  {
    id: 7,
    stage: 7,
    title: {
      en: "Stage 7: Short Stories",
      zh: "第 7 关：小故事"
    },
    description: {
      en: "Type sentences to practice real-world typing",
      zh: "输入简短的句子，体验真实的打字应用"
    },
    content: ["The cat sat on the mat.", "A quick brown fox jumps.", "I like to eat apples and bananas.", "Typing is fun!"]
  },
  {
    id: 8,
    stage: 8,
    title: {
      en: "Stage 8: Chinese Pinyin",
      zh: "第 8 关：拼音练中文"
    },
    description: {
      en: "Type the pinyin for Chinese characters",
      zh: "输入汉字对应的拼音"
    },
    content: [
      { text: "大", pinyin: "da" },
      { text: "小", pinyin: "xiao" },
      { text: "多", pinyin: "duo" },
      { text: "少", pinyin: "shao" },
      { text: "你", pinyin: "ni" },
      { text: "好", pinyin: "hao" },
      { text: "我", pinyin: "wo" },
      { text: "是", pinyin: "shi" },
      { text: "中", pinyin: "zhong" },
      { text: "国", pinyin: "guo" },
      { text: "人", pinyin: "ren" },
      { text: "天", pinyin: "tian" },
      { text: "地", pinyin: "di" },
      { text: "水", pinyin: "shui" },
      { text: "火", pinyin: "huo" }
    ]
  },
  {
    id: 9,
    stage: 9,
    title: {
      en: "Stage 9: Chinese Words",
      zh: "第 9 关：中文词语"
    },
    description: {
      en: "Type the pinyin for Chinese words",
      zh: "输入中文词组对应的拼音"
    },
    content: [
      { text: "苹果", pinyin: "pingguo" },
      { text: "香蕉", pinyin: "xiangjiao" },
      { text: "朋友", pinyin: "pengyou" },
      { text: "学校", pinyin: "xuexiao" },
      { text: "电脑", pinyin: "diannao" },
      { text: "键盘", pinyin: "jianpan" },
      { text: "快乐", pinyin: "kuaile" },
      { text: "学习", pinyin: "xuexi" },
      { text: "游戏", pinyin: "youxi" }
    ]
  }
];

const allPreviousContents = LEVELS.flatMap(l => l.content);
// Shuffle for the grand test
const shuffled = [...allPreviousContents].sort(() => 0.5 - Math.random()).slice(0, 20); // Take 20 random items for the test

LEVELS.push({
  id: 10,
  stage: 10,
  title: {
    en: "Stage 10: Grand Test",
    zh: "第 10 关：大测试"
  },
  description: {
    en: "A mix of everything you've learned!",
    zh: "前面9关内容的随机综合测试！"
  },
  content: shuffled
});
