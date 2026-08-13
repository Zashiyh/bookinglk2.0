"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Compass,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Waves,
  Wifi,
  Mountain,
} from "lucide-react";

interface DestinationData {
  name: string;
  province: string;
  description: string;
  longDescription: string;
  image: string;
  rating: number;
  hotels: number;
  categories: string[];
  bestTime: string;
  travelTime: string;
  highlights: string[];
  attractions: {
    name: string;
    description: string;
    image: string;
  }[];
}

const destinations: Record<string, DestinationData> = {
  kandy: {
    name: "Kandy",
    province: "Central Province",
    description:
      "Sri Lanka's cultural capital surrounded by misty mountains, sacred temples and beautiful landscapes.",
    longDescription:
      "Kandy is one of Sri Lanka's most iconic destinations, combining ancient heritage, spiritual landmarks and breathtaking mountain scenery. From the Temple of the Tooth Relic to the peaceful shores of Kandy Lake, the city offers a perfect blend of culture, nature and unforgettable stays.",
    image:
      "https://media.istockphoto.com/id/1307248869/photo/kandy-lake-and-city.jpg?s=612x612&w=0&k=20&c=mhMLi1I_CKBL4_ipyNPWgmuTE8RKOs8YiOazqZE-7Mg=",
    rating: 4.8,
    hotels: 124,
    categories: ["Culture", "Mountain", "Heritage"],
    bestTime: "December – April",
    travelTime: "3–4 hours from Colombo",
    highlights: [
      "Temple of the Tooth",
      "Kandy Lake",
      "Peradeniya Botanical Gardens",
      "Knuckles Mountain Range",
    ],
    attractions: [
      {
        name: "Temple of the Tooth",
        description:
          "One of Sri Lanka's most important Buddhist landmarks and a major cultural attraction.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsMR8FLfY-bRZVngWZgPN-drUQ060Z7T1qGZjkv3FWA0cUw24tBZVvIqz6&s=10",
      },
      {
        name: "Kandy Lake",
        description:
          "A peaceful lake in the heart of the city surrounded by beautiful mountain views.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Yy5jVkp939Xzv0BREL8C7L_t3Vv508eTARHYgfWsnw&s=10",
      },
      {
        name: "Peradeniya Botanical Gardens",
        description:
          "Explore one of Sri Lanka's most beautiful botanical gardens in Peradeniya.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaI0q5cdZI7y2H6Y3eP2cPdVBmqmJKMiM2qc9fNXs2zQ&s=10",
      },
    ],
  },

  ella: {
    name: "Ella",
    province: "Uva Province",
    description:
      "A breathtaking mountain escape filled with tea plantations, waterfalls and unforgettable views.",
    longDescription:
      "Ella is one of Sri Lanka's most loved mountain destinations. Surrounded by dramatic peaks, tea estates and waterfalls, Ella is perfect for travelers looking for adventure, relaxation and incredible scenery.",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/5c/95/73/caption.jpg?w=1200&h=-1&s=1",
    rating: 4.9,
    hotels: 86,
    categories: ["Mountain", "Adventure", "Nature"],
    bestTime: "January – May",
    travelTime: "5–6 hours from Colombo",
    highlights: [
      "Nine Arch Bridge",
      "Little Adam's Peak",
      "Ella Rock",
      "Ravana Falls",
    ],
    attractions: [
      {
        name: "Nine Arch Bridge",
        description:
          "Walk through the lush hills and watch trains cross this iconic colonial-era railway bridge.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Zv0P0Vmg-lOPIVGiFzCa2ApNrSBPFmfb4JUGZPvoNw&s=10",
      },
      {
        name: "Little Adam's Peak",
        description:
          "An accessible mountain hike offering panoramic views over Ella's green valleys.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqWpKPjp1X1q52BAClzXe4OTOU3OVFfJ_o5UBEiMXqMB6NmVjdWqZAuH4&s=10",
      },
      {
        name: "Ravana Falls",
        description:
          "A spectacular waterfall surrounded by dramatic mountain scenery.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBrpN2gj6zEUB40UEOFq0hYd_X3JoaCnfQ0MFncjTY4kJrccEDp6M3Ifg&s=10",
      },
    ],
  },

  galle: {
    name: "Galle",
    province: "Southern Province",
    description:
      "Historic streets, colonial architecture, tropical beaches and the legendary Galle Fort.",
    longDescription:
      "Galle is where Sri Lanka's colonial history meets the Indian Ocean. Explore the UNESCO-listed Galle Fort, discover boutique hotels and cafés, and enjoy some of the island's most beautiful southern beaches.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU-KZ4MZAfX6IzYrFDE7LDFxH99588WW7Qw86WvWBwsfy2PlwMFa-p10e-&s=10",
    rating: 4.7,
    hotels: 102,
    categories: ["Culture", "Beach", "Heritage"],
    bestTime: "December – April",
    travelTime: "2–3 hours from Colombo",
    highlights: [
      "Galle Fort",
      "Unawatuna Beach",
      "Jungle Beach",
      "Japanese Peace Pagoda",
    ],
    attractions: [
      {
        name: "Galle Fort",
        description:
          "Walk through centuries of history inside this iconic coastal fortress.",
        image:
          "https://thumbs.dreamstime.com/b/galle-fort-sri-lanka-travel-guide-explore-historic-architecture-beaches-cultural-sites-discover-beauty-galle-fort-sri-394523860.jpg",
      },
      {
        name: "Unawatuna Beach",
        description:
          "Relax on golden sand and swim in the calm turquoise waters of the south coast.",
        image:
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/17/f0/2d/20190407-165442-largejpg.jpg?w=1200&h=-1&s=1",
      },
      {
        name: "Japanese Peace Pagoda",
        description:
          "Enjoy panoramic coastal views from this peaceful hilltop landmark.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7YdAFbUWGVm2NsPihEzz-lJ_lNI3SkcvdtCsyZLuKcP7avluzlt8XZBg&s=10",
      },
    ],
  },

  "nuwara-eliya": {
    name: "Nuwara Eliya",
    province: "Central Province",
    description:
      "Cool mountain air, endless tea estates and peaceful highland landscapes.",
    longDescription:
      "Known as Little England, Nuwara Eliya offers a completely different side of Sri Lanka. Cool weather, rolling tea plantations, colonial architecture and scenic waterfalls make it a perfect escape from the tropical lowlands.",
    image:
      "https://srilankatravellife.com/wp-content/uploads/2025/11/Tea-Hills-in-Nuwara-Eliya.webp",
    rating: 4.7,
    hotels: 74,
    categories: ["Mountain", "Nature", "Tea Country"],
    bestTime: "February – May",
    travelTime: "4–5 hours from Colombo",
    highlights: [
      "Gregory Lake",
      "Tea plantations",
      "Horton Plains",
      "Lover's Leap",
    ],
    attractions: [
      {
        name: "Gregory Lake",
        description:
          "A scenic mountain lake surrounded by the cool highland landscape.",
        image:
          "https://thumbs.dreamstime.com/b/gregory-lake-nuwara-eliya-sri-lanka-landscape-60682193.jpg",
      },
      {
        name: "Tea Country",
        description:
          "Discover the tea-growing heart of Sri Lanka and experience traditional tea production.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHjonm2PwumLSo7A9okOtIht1q8nFojtO5YZ8kUFdQ7kCg6pod5UpXCVfm&s=10",
      },
      {
        name: "Horton Plains",
        description:
          "Explore dramatic landscapes, cloud forests and the famous World's End viewpoint.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdgwvpOd6OLvzggH24tjiM4Blesq2SKhRyMnZ2EqqlmvzKEjZoHuuTCulv&s=10",
      },
    ],
  },

  mirissa: {
    name: "Mirissa",
    province: "Southern Province",
    description:
      "Golden beaches, turquoise water, sunsets and laid-back coastal escapes.",
    longDescription:
      "Mirissa is a tropical paradise on Sri Lanka's southern coast. Relax on beautiful beaches, enjoy fresh seafood, explore nearby coastal attractions and experience unforgettable sunsets.",
    image:
      "https://t4.ftcdn.net/jpg/01/87/77/33/360_F_187773353_dFK1bBRKVQiLgUvfqzSut3829IHZhKCB.jpg",
    rating: 4.8,
    hotels: 68,
    categories: ["Beach", "Relaxation", "Adventure"],
    bestTime: "December – April",
    travelTime: "2.5–3 hours from Colombo",
    highlights: [
      "Mirissa Beach",
      "Whale Watching",
      "Parrot Rock",
      "Coconut Tree Hill",
    ],
    attractions: [
      {
        name: "Mirissa Beach",
        description:
          "Enjoy golden sand, turquoise water and spectacular sunsets.",
        image:
          "https://www.laurewanders.com/wp-content/uploads/2023/12/Things-to-do-in-Mirissa-00005.jpg",
      },
      {
        name: "Coconut Tree Hill",
        description:
          "One of the most photographed coastal viewpoints in southern Sri Lanka.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStCA0vVIbyxsUkxE0Ug7uRYmqFTm380crGz0t0wA9W4fjz0KFmB-QjDdA&s=10",
      },
      {
        name: "Whale Watching",
        description:
          "Take a boat trip into the Indian Ocean and search for majestic whales and dolphins.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQeL3cZPrSLPUEXoSZxa5alH18bxlkUnFUb_WTvLuSRVGx83DjKdj55ycj&s=10",
      },
    ],
  },

  sigiriya: {
    name: "Sigiriya",
    province: "Central Province",
    description:
      "Ancient history, the legendary Lion Rock and breathtaking jungle landscapes.",
    longDescription:
      "Sigiriya is home to one of Sri Lanka's most iconic landmarks. The ancient Lion Rock rises dramatically above the surrounding jungle and offers an unforgettable journey through history, archaeology and nature.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6wXx6JGFmeNVnZf1mFfBmVcbewkRlM3W_m-d2eU2ZZmtkkJaEjgy_AG3n&s=10",
    rating: 4.8,
    hotels: 59,
    categories: ["Culture", "Adventure", "Wildlife"],
    bestTime: "January – April",
    travelTime: "4–5 hours from Colombo",
    highlights: [
      "Sigiriya Rock",
      "Pidurangala Rock",
      "Ancient frescoes",
      "Minneriya Safari",
    ],
    attractions: [
      {
        name: "Sigiriya Rock",
        description:
          "Climb the ancient Lion Rock and discover one of Sri Lanka's greatest archaeological treasures.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJP__hVyn0xeHaiOcMHGn8mUBwZdB-GUyvluSlhWiT4NaDX-DrINntwTQ&s=10",
      },
      {
        name: "Pidurangala Rock",
        description:
          "Enjoy one of the best sunrise views overlooking Sigiriya.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-jOGpPvID5tUDWVj9AREug79mXQrL23gFHU7C_ceRI1aEKVmzEz8UQNg&s=10",
      },
      {
        name: "Minneriya Safari",
        description:
          "Experience Sri Lanka's wildlife and observe elephants in their natural environment.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9hcrebq4JubyYYchstBD42QL0IZsGWAcqhpMI7TUuDAzsoFE05IovOaM&s=10",
      },
    ],
  },

  bentota: {
    name: "Bentota",
    province: "Southern Province",
    description:
      "A tropical getaway with beautiful beaches, rivers, resorts and water adventures.",
    longDescription:
      "Bentota is one of Sri Lanka's most popular resort destinations. From relaxing on golden beaches to river safaris and water sports, Bentota is ideal for couples, families and adventure seekers.",
    image:
      "https://st5.depositphotos.com/19085394/64943/i/450/depositphotos_649438314-stock-photo-aerial-view-marakolliya-beach-sri.jpg",
    rating: 4.6,
    hotels: 81,
    categories: ["Beach", "Adventure", "Family"],
    bestTime: "November – April",
    travelTime: "1.5–2 hours from Colombo",
    highlights: [
      "Bentota Beach",
      "Madu River Safari",
      "Water Sports",
      "Brief Garden",
    ],
    attractions: [
      {
        name: "Bentota Beach",
        description:
          "A beautiful stretch of golden coastline perfect for swimming and relaxing.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT27gABSXReLfMCZA6it2J9MB_mbeEO58RYHWlMpMZEDRnunUtCj6Y5EZo&s=10",
      },
      {
        name: "Madu River",
        description:
          "Explore mangrove forests and small islands on a peaceful river safari.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7YNfAZyON_XEbOx5Kou0pnAX6eRwlmDVgmRgsEuztU_z6OzAGO7st1S0&s=10",
      },
      {
        name: "Water Adventures",
        description:
          "Enjoy jet skiing, banana boats, diving and other coastal activities.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-oef5aVKBtJ2SwkPCSySuIACx3SqiO_QI36Eivv8wkg&s=10",
      },
    ],
  },

  "arugam-bay": {
    name: "Arugam Bay",
    province: "Eastern Province",
    description:
      "World-class surfing, sunshine and a relaxed coastal atmosphere.",
    longDescription:
      "Arugam Bay is one of Sri Lanka's most famous surf destinations. With a laid-back atmosphere, beautiful beaches and a growing collection of cafés and boutique stays, it is perfect for travelers looking for adventure.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3lPEWYv7vP1Oe8ZCsBSgTBiuLAxVhOoOjVVe6w1rKSrKLGCGf_UYqMOM&s=10",
    rating: 4.7,
    hotels: 47,
    categories: ["Beach", "Adventure", "Surfing"],
    bestTime: "May – October",
    travelTime: "6–7 hours from Colombo",
    highlights: [
      "Main Point",
      "Whiskey Point",
      "Elephant Rock",
      "Lagoon Safari",
    ],
    attractions: [
      {
        name: "Main Point",
        description:
          "One of Sri Lanka's most famous surfing locations with powerful long waves.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5p_y9PWhcDtc4YcmMUOIbM8gGvRaBPAq_nBKF6wBxew&s=10",
      },
      {
        name: "Whiskey Point",
        description:
          "A quieter surf spot with beautiful scenery and relaxed coastal vibes.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-XSDsiMhev12e8k0_CGHwoKCWjHN6ID8bQpFQqN5rIM3cWdksfHlDMOE&s=10",
      },
      {
        name: "Elephant Rock",
        description:
          "A scenic coastal viewpoint where you can enjoy sunrise and sunset.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFxibybxYDCb1XICjbrc25RUlztnC7x3RhgrdOHQF4KB6lDjFt_F6WyMfB&s=10",
      },
    ],
  },

  yala: {
    name: "Yala",
    province: "Southern Province",
    description:
      "Get closer to Sri Lanka's wild side with unforgettable safari experiences.",
    longDescription:
      "Yala is the perfect destination for wildlife lovers. The national park is famous for its elephants, leopards, crocodiles and diverse birdlife, making every safari an exciting experience.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBAd2-GedPEhFMTxrRXihFwPL_6NW8Ogr4Z4UKDtabmcLpuxcOaDe72Oan&s=10",
    rating: 4.6,
    hotels: 42,
    categories: ["Wildlife", "Adventure", "Safari"],
    bestTime: "February – June",
    travelTime: "5–6 hours from Colombo",
    highlights: [
      "Yala National Park",
      "Leopard Safari",
      "Elephant Watching",
      "Bird Watching",
    ],
    attractions: [
      {
        name: "Yala National Park",
        description:
          "Explore one of Sri Lanka's most famous national parks on an unforgettable safari.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlaj5HL6pEz6hbDF99yxjhkeNq4zTYLBRH0X9nn4dKcQ&s=10",
      },
      {
        name: "Wildlife Safari",
        description:
          "Search for leopards, elephants, crocodiles and hundreds of bird species.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxQtbcDWxNIbkcPIqfo_Xd4bgRx-JeAJSV6MoGWo95hw&s=10",
      },
      {
        name: "Nature Experiences",
        description:
          "Experience Sri Lanka's wild landscapes away from the busy cities.",
        image:
          "https://theportuguesetraveler.com/wp-content/uploads/2024/11/sithulpawwa-rock-temple-yala-sri-lanka-13.jpg",
      },
    ],
  },

  colombo: {
    name: "Colombo",
    province: "Western Province",
    description:
      "Sri Lanka's energetic capital filled with food, shopping, nightlife and ocean views.",
    longDescription:
      "Colombo combines modern city life with Sri Lanka's rich cultural heritage. Explore restaurants, cafés, shopping malls, historic buildings and the beautiful Indian Ocean coastline.",
    image:
      "https://t3.ftcdn.net/jpg/03/11/68/40/360_F_311684069_HWkpTY5bxlv2hv4iFvPicfxbq3mvwzI3.jpg",
    rating: 4.5,
    hotels: 156,
    categories: ["City", "Culture", "Food"],
    bestTime: "January – March",
    travelTime: "30–60 minutes from Bandaranaike Airport",
    highlights: [
      "Galle Face Green",
      "Colombo Fort",
      "Pettah Market",
      "Lotus Tower",
    ],
    attractions: [
      {
        name: "Galle Face Green",
        description:
          "Enjoy sunset views, street food and the ocean breeze in the heart of Colombo.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEOtyHB13Rwu1GtLaoMN1xW3K_6MCXNz6YEnqQvB2wVIj8HObpie3WoIw&s=10",
      },
      {
        name: "Colombo City",
        description:
          "Discover modern shopping, restaurants, cafés and entertainment.",
        image:
          "https://media.istockphoto.com/id/1251580617/photo/background-view-of-the-colombo-city-skyline-with-modern-architecture-buildi.jpg?s=612x612&w=0&k=20&c=dYuA923PJPoIf4YEQgBSlEEMkK-HP6Sxj5Ty0DMX7KE=",
      },
      {
        name: "Lotus Tower",
        description:
          "See Colombo from above at one of Sri Lanka's most recognizable landmarks.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdY4Cxg0T5pUK0a3VsQ5l8wzNw2qx7_a81mna-xoXY0j5sCsJJP2XzLrg&s=10",
      },
    ],
  },

  hikkaduwa: {
    name: "Hikkaduwa",
    province: "Southern Province",
    description:
      "A lively beach destination known for coral reefs, surfing and coastal nightlife.",
    longDescription:
      "Hikkaduwa is one of Sri Lanka's classic beach destinations. Its coral reefs, warm waters, surf culture and lively nightlife make it a favorite among both local and international travelers.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW98MzrtF5qf0EmRsmYS0Owtd6QxpnbyOr28IvcYPPt2hBRwnkt4bVHovM&s=10",
    rating: 4.6,
    hotels: 73,
    categories: ["Beach", "Adventure", "Surfing"],
    bestTime: "November – April",
    travelTime: "2–2.5 hours from Colombo",
    highlights: [
      "Hikkaduwa Beach",
      "Coral Reef",
      "Turtle Watching",
      "Surfing",
    ],
    attractions: [
      {
        name: "Hikkaduwa Beach",
        description:
          "Relax on the beach, surf the waves or enjoy the vibrant coastal atmosphere.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFHiG11kKpckO_b6RGJdSoVRw2moxduNjPHmU36minMZRL3zzePXNVMFk&s=10",
      },
      {
        name: "Coral Reef",
        description:
          "Explore colorful marine life through snorkeling and diving experiences.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6vqvw9LEWmm2pqIFfyhoL5o2wtP0NLQ0LYx5qoQ-zfg&s=10",
      },
      {
        name: "Surfing",
        description:
          "Enjoy fun waves suitable for beginners and experienced surfers.",
        image:
          "https://media.istockphoto.com/id/483376271/photo/surfing-sri-lanka.jpg?s=612x612&w=0&k=20&c=ckw76eRGm17zqBeSpS8gkNVBVp9gO5TyD-Ib6XMzV0Y=",
      },
    ],
  },

  anuradhapura: {
    name: "Anuradhapura",
    province: "North Central Province",
    description:
      "Ancient cities, sacred stupas and thousands of years of Sri Lankan history.",
    longDescription:
      "Anuradhapura was one of the ancient capitals of Sri Lanka and remains one of the country's most important historical and religious destinations. Explore enormous stupas, sacred trees and ancient ruins spread across a vast cultural landscape.",
    image:
      "https://t3.ftcdn.net/jpg/11/93/23/14/360_F_1193231427_YJ4pZjJfQKJWG5i7Kk21aaNQMjTfqHI3.jpg",
    rating: 4.6,
    hotels: 51,
    categories: ["Culture", "Heritage", "History"],
    bestTime: "April – September",
    travelTime: "4–5 hours from Colombo",
    highlights: [
      "Sri Maha Bodhi",
      "Ruwanwelisaya",
      "Abhayagiri",
      "Ancient City",
    ],
    attractions: [
      {
        name: "Ruwanwelisaya",
        description:
          "One of Sri Lanka's most revered ancient stupas with an impressive white dome.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSWUKL2fghohhqT058BNegJ91eCDqaSo01wIbATNsy33dMuWSp5UBSTcch&s=10",
      },
      {
        name: "Sri Maha Bodhi",
        description:
          "Visit one of the world's oldest historically documented trees.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkk-1QdLwBfvcKs_FwEpkWjphLOMIjWNtB6f1lZasrxGTFzKDmWbrwCUxC&s=10",
      },
      {
        name: "Ancient City",
        description:
          "Explore the enormous archaeological area filled with ancient monuments and ruins.",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzjX1eS35lboczm88onn5FRBlZ3WERO6CRa8EGM5mTz0Y9Tj91w73dTU8&s=10",
      },
    ],
  },
};

function getIcon(category: string) {
  if (category === "Beach" || category === "Surfing") {
    return Waves;
  }

  if (category === "Mountain" || category === "Tea Country") {
    return Mountain;
  }

  if (category === "Wildlife" || category === "Safari") {
    return Trees;
  }

  if (category === "City") {
    return Compass;
  }

  return Sparkles;
}

export default function DestinationDetailPage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug.toLowerCase()
      : "";

  const destination = destinations[slug];

  if (!destination) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 text-[var(--foreground)]">
        
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
            <MapPin className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Destination not found
          </h1>

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            We couldn't find the destination you're looking for.
          </p>

          <Link
            href="/destinations"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to destinations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[680px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-black/90" />

        {/* Ambient glow */}

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-[110px]"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-[25%] h-80 w-80 rounded-full bg-white/10 blur-[120px]"
        />

        {/* Hero content */}

        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-end px-5 pb-28 pt-32 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="mb-5"
            >
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-xl transition hover:bg-white/15"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All destinations
              </Link>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/75 backdrop-blur-xl">
                <MapPin className="h-3.5 w-3.5 text-[#F5D76E]" />
                {destination.province}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/75 backdrop-blur-xl">
                <Star className="h-3.5 w-3.5 fill-[#F5D76E] text-[#F5D76E]" />
                {destination.rating}
              </span>
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="mt-5 text-5xl font-black tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl"
            >
              {destination.name}
              <span className="text-[#F5D76E]">.</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.3,
              }}
              className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg"
            >
              {destination.description}
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.4,
              }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href={`/hotels?destination=${slug}`}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
              >
                Explore {destination.hotels} hotels

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/15"
              >
                Discover destination
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Bottom stats */}

        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/25 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            <Stat
              value={destination.hotels}
              label="Hotels"
              suffix="+"
            />

            <Stat
              value={destination.rating}
              label="Average rating"
              decimals={1}
            />

            <Stat
              value={destination.categories.length}
              label="Experiences"
            />

            <StaticStat
              value="24/7"
              label="Booking support"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Discover {destination.name}
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              More than a destination.
              <span className="block text-zinc-400 dark:text-zinc-600">
                It's an experience.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
              {destination.longDescription}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {destination.categories.map((category) => {
                const Icon = getIcon(category);

                return (
                  <span
                    key={category}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#B8860B] dark:text-[#F5D76E]" />
                    {category}
                  </span>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
            className="rounded-[2rem] border border-black/5 bg-zinc-50 p-7 dark:border-white/5 dark:bg-[#111111]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Travel information
            </p>

            <div className="mt-6 space-y-5">
              <InfoRow
                icon={CalendarDays}
                title="Best time to visit"
                value={destination.bestTime}
              />

              <InfoRow
                icon={Car}
                title="Travel time"
                value={destination.travelTime}
              />

              <InfoRow
                icon={Building2}
                title="Available stays"
                value={`${destination.hotels}+ hotels`}
              />

              <InfoRow
                icon={ShieldCheck}
                title="Booking"
                value="Secure & trusted"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          HIGHLIGHTS
      ====================================================== */}

      <section className="border-y border-black/5 bg-zinc-50 dark:border-white/5 dark:bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Don't miss
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Highlights of {destination.name}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destination.highlights.map((highlight, index) => (
              <motion.div
                key={highlight}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="group rounded-3xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/40 dark:border-white/5 dark:bg-[#111111]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-bold">
                  {highlight}
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Experience one of the must-see highlights
                  around {destination.name}.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ATTRACTIONS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Things to do
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Experience {destination.name}
            </h2>
          </div>

          <Link
            href={`/hotels?destination=${slug}`}
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#B8860B] dark:text-[#F5D76E]"
          >
            Find a place to stay

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {destination.attractions.map(
            (attraction, index) => (
              <motion.article
                key={attraction.name}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white dark:border-white/5 dark:bg-[#111111]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    onError={(event) => {
                      event.currentTarget.src =
                        "/images/hotel-placeholder.jpg";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <h3 className="text-xl font-black text-white">
                      {attraction.name}
                    </h3>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {attraction.description}
                  </p>
                </div>
              </motion.article>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          HOTEL CTA
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-8 sm:p-12 lg:p-16"
        >
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-[100px]" />

          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5 blur-[100px]" />

          <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-[#F5D76E]" />
                Stay in {destination.name}
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to explore
                <span className="text-[#F5D76E]">
                  {" "}
                  {destination.name}?
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-6 text-white/55">
                Discover hand-picked hotels, resorts and
                stays around {destination.name}. Find the
                perfect place for your next escape.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <MiniFeature
                  icon={ShieldCheck}
                  text="Secure booking"
                />

                <MiniFeature
                  icon={Wifi}
                  text="Verified properties"
                />

                <MiniFeature
                  icon={Star}
                  text="Guest rated"
                />
              </div>
            </div>

            <Link
              href={`/hotels?destination=${slug}`}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-7 py-4 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
            >
              Explore hotels

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="border-t border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
            <Compass className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
            Your Sri Lankan
            <span className="text-[#B8860B] dark:text-[#F5D76E]">
              {" "}
              story
            </span>
            <br />
            starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Explore more destinations and discover the
            perfect stay for your next journey.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/hotels?destination=${slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
            >
              Find hotels
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-6 py-3.5 text-sm font-bold transition hover:border-[#D4AF37] dark:border-white/10"
            >
              Explore destinations
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   COUNT UP STAT
========================================================= */

function Stat({
  value,
  label,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      // Smooth ease-out
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setCount(value * easedProgress);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  const displayValue =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toString();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="px-5 py-5 text-center sm:py-6"
    >
      <motion.p
        className="text-xl font-black text-white sm:text-2xl"
        key={displayValue}
      >
        {displayValue}
        {suffix}
      </motion.p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-xs">
        {label}
      </p>
    </motion.div>
  );
}

/* =========================================================
   STATIC STAT
========================================================= */

function StaticStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="px-5 py-5 text-center sm:py-6"
    >
      <p className="text-xl font-black text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-xs">
        {label}
      </p>
    </motion.div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-zinc-400">
          {title}
        </p>

        <p className="mt-1 text-sm font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MINI FEATURE
========================================================= */

function MiniFeature({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/65">
      <Icon className="h-3.5 w-3.5 text-[#F5D76E]" />
      {text}
    </div>
  );
}