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
  }
];
