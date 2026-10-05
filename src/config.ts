export const site = {
  name: '山と、余白。',
  englishName: 'YAMA TO YOHAKU',
  description: '日常を少し離れて、山のある時間へ。山歩きの記録と、道具のこと、自然のなかで見つけた小さな余白。',
};

export const categories = [
  { id: 'hiking', label: '山の記録', english: 'HIKING JOURNAL' },
  { id: 'gear', label: '道具と支度', english: 'GEAR & PREPARATION' },
  { id: 'essay', label: '山のひとこま', english: 'MOUNTAIN MOMENTS' },
] as const;

export const photos = {
  lake: { src: '/images/mikurigaike.webp', alt: '青いみくりが池と北アルプスの稜線', location: '立山・みくりが池', source: 'https://commons.wikimedia.org/wiki/File:Japanese_alps_lake_panorama_(51830704972).jpg' },
  forest: { src: '/images/forest.webp', alt: '北アルプスの深い緑の森', location: '北アルプス', source: 'https://commons.wikimedia.org/wiki/File:Japanese_alps_forest_(51831653906).jpg' },
  ridge: { src: '/images/ridge.webp', alt: '幾重にも連なる北アルプスの山並み', location: '北アルプス', source: 'https://commons.wikimedia.org/wiki/File:Japanese_Alps_(51831654271).jpg' },
};
