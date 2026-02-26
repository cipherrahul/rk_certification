import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "Home | RK Institution - Skill-Based Professional Education",
  description: "Join RK Institution for industry-leading professional education in JEE, NEET, Full Stack Development, and more. Transform your career with expert mentorship since 2016.",
  openGraph: {
    title: "RK Institution - Build Real Skills, Shape Your Future",
    description: "Expert-led programs designed to bridge the gap between academic learning and real-world career success.",
  }
};

export default function Home() {
  return <HomeClient />;
}
