export type Pillar = "abiding" | "making" | "enjoying";

export interface Scripture {
  reference: string;
  text: string;
}

export interface Marker {
  id: number;
  name: string;
  pillar: Pillar;
  definition: string;
  quizHint: string; // short summary that avoids using the marker's name words
  scripture: Scripture;
  icon: string; // emoji icon for visual identity
  color: string; // Tailwind color class for accent
}

export const PILLARS: Record<Pillar, { label: string; description: string; scripture: Scripture; color: string; order: number }> = {
  abiding: {
    label: "Abiding in Jesus",
    description:
      "These markers reflect a community rooted in personal communion with Jesus — through his Word, prayer, and the Spirit.",
    scripture: {
      reference: "John 15:4–5",
      text: "Abide in me, and I in you. As the branch cannot bear fruit by itself, unless it abides in the vine, neither can you, unless you abide in me. I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit, for apart from me you can do nothing.",
    },
    color: "blue",
    order: 1,
  },
  making: {
    label: "Making Disciples",
    description:
      "These markers shape how we live on mission — sharing the gospel and intentionally investing in others.",
    scripture: {
      reference: "Matthew 28:19–20",
      text: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.",
    },
    color: "green",
    order: 2,
  },
  enjoying: {
    label: "Enjoying Life Together",
    description:
      "These markers express what it looks like to belong to one another and grow together as the body of Christ.",
    scripture: {
      reference: "Ephesians 4:15–16",
      text: "Rather, speaking the truth in love, we are to grow up in every way into him who is the head, into Christ, from whom the whole body, joined and held together by every joint with which it is equipped, when each part is working properly, makes the body grow so that it builds itself up in love.",
    },
    color: "amber",
    order: 3,
  },
};

export const VISION_STATEMENT =
  "Abiding in Jesus, we are making disciples together.";

export const MARKERS: Marker[] = [
  {
    id: 1,
    name: "A Gospel-Saturated Church",
    pillar: "abiding",
    definition:
      "A Gospel-Saturated Church is one where the good news of Jesus Christ — his life, death, and resurrection — is central to everything we do. We understand, believe, and live in light of the gospel, allowing it to shape our identity, our relationships, and our mission.",
    quizHint:
      "The good news of Jesus is the central message shaping everything we do — our identity, relationships, and mission.",
    scripture: {
      reference: "Acts 2:38",
      text: "And Peter said to them, 'Repent and be baptized every one of you in the name of Jesus Christ for the forgiveness of your sins, and you will receive the gift of the Holy Spirit.'",
    },
    icon: "✝️",
    color: "blue",
  },
  {
    id: 2,
    name: "A Praying Church",
    pillar: "abiding",
    definition:
      "A Praying Church is one that depends wholly on God through constant, corporate, and personal prayer. We believe prayer is not a last resort but our first response — an ongoing conversation with the God who hears and answers.",
    quizHint:
      "Depending wholly on God through constant conversation — not as a last resort but as our first response.",
    scripture: {
      reference: "Acts 6:4",
      text: "But we will devote ourselves to prayer and to the ministry of the word.",
    },
    icon: "🙏",
    color: "blue",
  },
  {
    id: 3,
    name: "A Spirit-Led Church",
    pillar: "abiding",
    definition:
      "A Spirit-Led Church is one that acknowledges its total dependence on the Holy Spirit for life, power, and direction. We seek to be filled with the Spirit, sensitive to his leading, and empowered by his gifts for the sake of the gospel.",
    quizHint:
      "Total dependence on the third person of the Trinity for life, power, direction, and empowerment in all we do.",
    scripture: {
      reference: "Acts 1:8",
      text: "But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.",
    },
    icon: "🔥",
    color: "blue",
  },
  {
    id: 4,
    name: "A Bible-Revering Church",
    pillar: "abiding",
    definition:
      "A Bible-Revering Church is one that holds the Scriptures as the inspired, inerrant, and sufficient Word of God. We are committed to reading, studying, teaching, and obeying the Bible as the ultimate authority for faith and life.",
    quizHint:
      "Holding God's written Word as inspired, inerrant, and sufficient — the ultimate authority for faith and life.",
    scripture: {
      reference: "Acts 1:16",
      text: "Brothers, the Scripture had to be fulfilled, which the Holy Spirit spoke beforehand by the mouth of David concerning Judas, who became a guide to those who arrested Jesus.",
    },
    icon: "📖",
    color: "blue",
  },
  {
    id: 5,
    name: "A Missional Church",
    pillar: "making",
    definition:
      "A Missional Church is one that understands every member is sent by God into their everyday life — their neighborhood, workplace, and relational networks — as an ambassador of the kingdom. We don't just invite people to church; we bring the church to people.",
    quizHint:
      "Every member is an ambassador of the kingdom in their neighborhood, workplace, and relational networks.",
    scripture: {
      reference: "Acts 8:4",
      text: "Now those who were scattered went about preaching the word.",
    },
    icon: "🌍",
    color: "green",
  },
  {
    id: 6,
    name: "A Maturing Church",
    pillar: "making",
    definition:
      "A Maturing Church is one committed to ongoing spiritual growth and transformation. We believe discipleship is a lifelong process of becoming more like Jesus, and we invest in one another's growth through teaching, mentoring, and accountability.",
    quizHint:
      "Committed to lifelong transformation — becoming more like Jesus through teaching, mentoring, and accountability.",
    scripture: {
      reference: "Acts 18:25–26",
      text: "He had been instructed in the way of the Lord. And being fervent in spirit, he spoke and taught accurately the things concerning Jesus, though he knew only the baptism of John. He began to speak boldly in the synagogue, but when Priscilla and Aquila heard him, they took him aside and explained to him the way of God more accurately.",
    },
    icon: "🌱",
    color: "green",
  },
  {
    id: 7,
    name: "A Sending Church",
    pillar: "making",
    definition:
      "A Sending Church is one that actively identifies, equips, and releases people for gospel work near and far. We hold our people with open hands, celebrating when God calls them to go, and we invest in gospel movements around the world.",
    quizHint:
      "Identifying, equipping, and releasing people for gospel work — holding them with open hands as God calls them to go.",
    scripture: {
      reference: "Acts 13:2–3",
      text: "While they were worshiping the Lord and fasting, the Holy Spirit said, 'Set apart for me Barnabas and Saul for the work to which I have called them.' Then after fasting and praying they laid their hands on them and sent them off.",
    },
    icon: "✈️",
    color: "green",
  },
  {
    id: 8,
    name: "A Shepherding Church",
    pillar: "enjoying",
    definition:
      "A Shepherding Church is one where leaders care for the souls of those entrusted to them, and where members care for one another. We believe every person needs to be known, loved, and guided — and we take that responsibility seriously.",
    quizHint:
      "Leaders care for the souls entrusted to them, and members care for one another — everyone is known, loved, and guided.",
    scripture: {
      reference: "Hebrews 13:17",
      text: "Obey your leaders and submit to them, for they are keeping watch over your souls, as those who will have to give an account. Let them do this with joy and not with groaning, for that would be of no advantage to you.",
    },
    icon: "🐑",
    color: "amber",
  },
  {
    id: 9,
    name: "A Community Church",
    pillar: "enjoying",
    definition:
      "A Community Church is one where authentic, life-giving relationships are woven into the fabric of our common life. We don't just attend church — we do life together, bearing one another's burdens and celebrating one another's joys.",
    quizHint:
      "Authentic, life-giving relationships woven into our common life — doing life together, bearing burdens and celebrating joys.",
    scripture: {
      reference: "Acts 2:44",
      text: "And all who believed were together and had all things in common.",
    },
    icon: "👥",
    color: "amber",
  },
  {
    id: 10,
    name: "A Unifying Church",
    pillar: "enjoying",
    definition:
      "A Unifying Church is one that reflects the reconciling power of the gospel across every dividing line — race, class, age, and background. We believe unity is not uniformity, but a Spirit-wrought oneness that testifies to the world that Jesus is Lord.",
    quizHint:
      "Reflecting the reconciling power of the gospel across every dividing line — race, class, age, and background.",
    scripture: {
      reference: "Ephesians 4:1–6",
      text: "I therefore, a prisoner for the Lord, urge you to walk in a manner worthy of the calling to which you have been called, with all humility and gentleness, with patience, bearing with one another in love, eager to maintain the unity of the Spirit in the bond of peace. There is one body and one Spirit — just as you were called to the one hope that belongs to your call — one Lord, one faith, one baptism, one God and Father of all, who is over all and through all and in all.",
    },
    icon: "🤝",
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
