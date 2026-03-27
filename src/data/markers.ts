export type Pillar = "abiding" | "making" | "together";

export interface Scripture {
  reference: string;
  text: string;
}

export interface Marker {
  id: number;
  name: string;
  pillar: Pillar;
  definition: string;
  scripture: Scripture;
  icon: string; // emoji icon for visual identity
  color: string; // Tailwind color class for accent
}

export const PILLARS: Record<Pillar, { label: string; description: string; color: string; order: number }> = {
  abiding: {
    label: "Abiding in Jesus",
    description:
      "These markers reflect a life rooted in personal communion with Jesus — through his Word, prayer, and the Spirit.",
    color: "blue",
    order: 1,
  },
  making: {
    label: "Making Disciples",
    description:
      "These markers shape how we live on mission — sharing the gospel and intentionally investing in others.",
    color: "green",
    order: 2,
  },
  together: {
    label: "Together",
    description:
      "These markers express what it looks like to belong to one another and grow as the body of Christ.",
    color: "amber",
    order: 3,
  },
};

export const VISION_STATEMENT =
  "Abiding in Jesus, we are making disciples together.";

export const MARKERS: Marker[] = [
  {
    id: 1,
    name: "Gospel Saturated",
    pillar: "abiding",
    definition:
      "I understand, believe, and am living in light of the gospel — the good news that Jesus Christ, the Son of God, lived the life I should have lived, died the death I deserved to die, and rose again so that I might be forgiven of my sin and reconciled to God.",
    scripture: {
      reference: "2 Corinthians 5:21",
      text: "For our sake he made him to be sin who knew no sin, so that in him we might become the righteousness of God.",
    },
    icon: "✝️",
    color: "blue",
  },
  {
    id: 2,
    name: "Biblically Saturated",
    pillar: "abiding",
    definition:
      "I believe the Bible is the inspired, inerrant, and sufficient Word of God. I am regularly reading, studying, memorizing, and meditating on it so that it shapes every area of my life.",
    scripture: {
      reference: "2 Timothy 3:16–17",
      text: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness, that the man of God may be complete, equipped for every good work.",
    },
    icon: "📖",
    color: "blue",
  },
  {
    id: 3,
    name: "Spirit Filled",
    pillar: "abiding",
    definition:
      "I am surrendering to and being led by the Holy Spirit in every area of my life, producing his fruit and using his gifts to build up the body of Christ.",
    scripture: {
      reference: "Galatians 5:16",
      text: "But I say, walk by the Spirit, and you will not gratify the desires of the flesh.",
    },
    icon: "🔥",
    color: "blue",
  },
  {
    id: 4,
    name: "Prayerful",
    pillar: "abiding",
    definition:
      "I am regularly and persistently communicating with God — adoring him, confessing sin, giving thanks, and making requests — as an expression of dependence on and delight in him.",
    scripture: {
      reference: "Philippians 4:6",
      text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.",
    },
    icon: "🙏",
    color: "blue",
  },
  {
    id: 5,
    name: "Evangelistic",
    pillar: "making",
    definition:
      "I am intentionally and regularly sharing the gospel with those who don't know Jesus, praying for the lost, and looking for opportunities to point people to Christ.",
    scripture: {
      reference: "Acts 1:8",
      text: "But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.",
    },
    icon: "📢",
    color: "green",
  },
  {
    id: 6,
    name: "Discipling",
    pillar: "making",
    definition:
      "I am intentionally investing in the lives of others to help them know, trust, follow, and obey Jesus — and to do the same for others.",
    scripture: {
      reference: "Matthew 28:19–20",
      text: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.",
    },
    icon: "🤝",
    color: "green",
  },
  {
    id: 7,
    name: "Missional",
    pillar: "making",
    definition:
      "I understand that I am sent by God into my everyday life — my neighborhood, workplace, and relational networks — as an ambassador of the kingdom of God.",
    scripture: {
      reference: "2 Corinthians 5:20",
      text: "Therefore, we are ambassadors for Christ, God making his appeal through us. We implore you on behalf of Christ, be reconciled to God.",
    },
    icon: "🌍",
    color: "green",
  },
  {
    id: 8,
    name: "Gifted & Serving",
    pillar: "together",
    definition:
      "I am discovering, developing, and deploying my spiritual gifts in service to the body of Christ and the world, for God's glory and the good of others.",
    scripture: {
      reference: "1 Peter 4:10",
      text: "As each has received a gift, use it to serve one another, as good stewards of God's varied grace.",
    },
    icon: "🎁",
    color: "amber",
  },
  {
    id: 9,
    name: "Submitted to Community",
    pillar: "together",
    definition:
      "I am committed to authentic, accountable relationships in the body of Christ where I am known, where I can know others, and where we spur one another on toward love and good deeds.",
    scripture: {
      reference: "Hebrews 10:24–25",
      text: "And let us consider how to stir up one another to love and good works, not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near.",
    },
    icon: "👥",
    color: "amber",
  },
  {
    id: 10,
    name: "Stewarding Life Well",
    pillar: "together",
    definition:
      "I recognize that everything I have — my time, talents, treasure, and influence — belongs to God, and I am faithfully managing it all for his glory and the advancement of his kingdom.",
    scripture: {
      reference: "Matthew 25:21",
      text: "His master said to him, 'Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master.'",
    },
    icon: "⚖️",
    color: "amber",
  },
];

export function getMarkersByPillar(pillar: Pillar): Marker[] {
  return MARKERS.filter((m) => m.pillar === pillar);
}

export function getMarkerById(id: number): Marker | undefined {
  return MARKERS.find((m) => m.id === id);
}

export function getPillarForMarker(markerId: number): Pillar | undefined {
  return MARKERS.find((m) => m.id === markerId)?.pillar;
}

export function getNextMarker(currentId: number): Marker | undefined {
  const current = MARKERS.find((m) => m.id === currentId);
  if (!current) return undefined;
  return MARKERS.find((m) => m.id === currentId + 1);
}

export function getPillarProgress(
  pillar: Pillar,
  completedMarkerIds: number[]
): { completed: number; total: number } {
  const pillarMarkers = getMarkersByPillar(pillar);
  const completed = pillarMarkers.filter((m) =>
    completedMarkerIds.includes(m.id)
  ).length;
  return { completed, total: pillarMarkers.length };
}
