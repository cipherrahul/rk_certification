export interface Job {
    id: string;
    title: string;
    department: string;
    type: string; // Full-time, Part-time
    location: string;
    lastDate: string;
    badge?: string; // e.g. "Urgent", "Female Only"
    badgeColor?: string;
    shortDescription: string;
    aboutRole: string;
    responsibilities: string[];
    qualifications: string[];
    skills: string[];
    salaryRange: string;
    perks: string[];
}

export const jobs: Job[] = [
    {
        id: "arts-teacher-cbse",
        title: "Arts Teacher (11th & 12th)",
        department: "Academics",
        type: "Full-time",
        location: "Delhi (On-site)",
        lastDate: "31 March 2026",
        badge: "Urgent",
        badgeColor: "red",
        shortDescription: "We are looking for a passionate and experienced Arts teacher to join our faculty for CBSE 11th and 12th classes (English & Hindi Medium).",
        aboutRole: "As an Arts teacher at RK Institution, you will be responsible for delivering high-quality instruction in subjects like History, Political Science, Geography, and Economics to Class 11 and 12 students. You will work in a dynamic, student-first environment where academic rigor meets creative pedagogy.",
        responsibilities: [
            "Teach CBSE Arts stream subjects (History, Pol. Science, Geography, Economics, etc.) for Class 11 & 12.",
            "Plan and deliver engaging, outcome-driven lesson plans in both English and Hindi medium.",
            "Prepare students for CBSE Board examinations with regular practice tests and mock papers.",
            "Maintain student progress records and provide detailed performance feedback.",
            "Participate in parent-teacher meetings and provide constructive updates.",
            "Collaborate with co-teachers to build an integrated, interdisciplinary curriculum.",
            "Mentor students and ensure a positive and inclusive classroom environment.",
        ],
        qualifications: [
            "Bachelor's degree in Arts (B.A.) is mandatory; Master's degree (M.A.) in relevant subject preferred.",
            "B.Ed. (Bachelor of Education) is compulsory from a recognized university.",
            "Minimum 1-2 years of teaching experience at the +2 (Senior Secondary) level.",
            "Proficiency in teaching through both English and Hindi medium.",
            "Knowledge of CBSE curriculum, NCERT textbooks, and examination patterns.",
            "Strong communication skills and classroom management abilities.",
        ],
        skills: ["CBSE Curriculum", "Lesson Planning", "Student Assessment", "NCERT Textbooks", "MS Office", "Communication"],
        salaryRange: "₹15,000 – ₹25,000/month",
        perks: ["Provident Fund (PF)", "Paid Leaves", "Festival Bonuses", "Professional Development Workshops", "Friendly Work Culture"],
    },
    {
        id: "receptionist",
        title: "Receptionist",
        department: "Administration",
        type: "Full-time",
        location: "Delhi (On-site)",
        lastDate: "31 March 2026",
        badge: "",
        badgeColor: "",
        shortDescription: "We are seeking a well-presented, organized, and friendly Receptionist to be the first point of contact for students, parents, and visitors at our institute.",
        aboutRole: "As the face of RK Institution, the Receptionist will manage front-desk operations, handle inquiries, and provide a warm, professional welcome to everyone who visits. This is a critical role that ensures smooth day-to-day administrative functioning.",
        responsibilities: [
            "Greet and assist students, parents, and visitors in a professional and courteous manner.",
            "Manage phone calls, emails, and WhatsApp messages regarding admissions and general inquiries.",
            "Maintain visitor logs and manage appointment scheduling for faculty and management.",
            "Handle student enrollment documentation, fee receipts, and basic data entry.",
            "Coordinate with departments for smooth internal communication.",
            "Maintain the front-desk area in a tidy and organized manner.",
            "Assist with admission drives, events, and promotional activities.",
        ],
        qualifications: [
            "Minimum 12th pass; Graduate (B.A. / B.Com / BBA) preferred.",
            "0–2 years experience in a similar front-desk or customer service role.",
            "Proficiency in MS Office (Word, Excel) and basic computer operations.",
            "Excellent verbal communication in Hindi and English.",
            "Pleasing personality with a professional and positive attitude.",
        ],
        skills: ["Communication", "MS Office", "Customer Service", "Data Entry", "Multitasking", "Hindi & English"],
        salaryRange: "₹10,000 – ₹18,000/month",
        perks: ["Paid Leaves", "Festival Bonuses", "Training Provided", "Positive Work Environment"],
    },
    {
        id: "primary-teacher-female",
        title: "Primary Teacher (Female Only)",
        department: "Academics",
        type: "Full-time",
        location: "Delhi (On-site)",
        lastDate: "31 March 2026",
        badge: "Female Only",
        badgeColor: "pink",
        shortDescription: "We are looking for an enthusiastic and nurturing female Primary Teacher to educate and inspire young learners in Classes 1st through 8th.",
        aboutRole: "The Primary Teacher will play a foundational role in shaping the academic and social development of children at RK Institution. We seek someone who is passionate about early childhood education, possesses creative teaching methodologies, and can build a strong, safe learning environment for every child.",
        responsibilities: [
            "Teach core subjects (English, Hindi, Mathematics, Science, Social Studies) to students of Class 1 to 8.",
            "Design and implement creative, activity-based lesson plans aligned with the CBSE/NCERT curriculum.",
            "Monitor and evaluate student progress through regular assignments, tests, and observations.",
            "Maintain a safe, inclusive, and positive classroom culture.",
            "Communicate effectively with parents regarding student performance and behaviour.",
            "Organize and participate in school events, PTMs, and cultural activities.",
            "Maintain classroom discipline with a firm yet empathetic approach.",
        ],
        qualifications: [
            "Graduate in any stream; Education degree (B.El.Ed / B.Ed / D.El.Ed) is mandatory.",
            "Minimum 1 year of experience in teaching primary classes is preferred.",
            "Strong understanding of child psychology and basic pedagogy.",
            "Ability to teach in both Hindi and English medium.",
            "Good communication, patience, and nurturing attitude.",
            "Applications ONLY accepted from female candidates.",
        ],
        skills: ["Classroom Management", "Child Psychology", "NCERT Curriculum", "Creative Teaching", "Patience", "Communication"],
        salaryRange: "₹12,000 – ₹20,000/month",
        perks: ["Provident Fund (PF)", "Paid Maternity Leave", "Festival Bonuses", "Annual Increments", "Safe Work Environment"],
    },
    {
        id: "video-editor",
        title: "Video Editor",
        department: "Digital Media",
        type: "Full-time",
        location: "Delhi / Remote (Hybrid)",
        lastDate: "31 March 2026",
        badge: "New",
        badgeColor: "blue",
        shortDescription: "We are looking for a talented and creative Video Editor to produce high-quality educational and promotional content for RK Institution's online and offline channels.",
        aboutRole: "The Video Editor will be a core part of our growing Digital Media team, responsible for editing, producing, and publishing video content including lecture recordings, promotional reels, YouTube content, and social media shorts. You will work hands-on with our content team to bring our brand's story to life.",
        responsibilities: [
            "Edit and produce educational videos, lecture recordings, and course content for online platforms.",
            "Create short-form video content (Reels, Shorts, YouTube videos) for social media channels.",
            "Add captions, graphics, animations, and sound effects to enhance video quality.",
            "Work with the Content Creator team to align video output with brand guidelines.",
            "Color grade and audio mix content for a professional finish.",
            "Manage raw footage libraries and maintain organized project archives.",
            "Meet consistent content delivery deadlines without compromising on quality.",
        ],
        qualifications: [
            "Diploma or Bachelor's degree in Film Making, Media Production, or related field preferred.",
            "Minimum 1 year of professional video editing experience.",
            "Proficiency in Adobe Premiere Pro, DaVinci Resolve, or Final Cut Pro X.",
            "Basic knowledge of Adobe After Effects for motion graphics.",
            "Strong portfolio or showreel demonstrating editing skills (mandatory).",
            "Knowledge of YouTube and Instagram content strategy is a bonus.",
        ],
        skills: ["Premiere Pro", "DaVinci Resolve", "After Effects", "Color Grading", "Audio Mixing", "YouTube SEO"],
        salaryRange: "₹18,000 – ₹30,000/month",
        perks: ["Hybrid Work Model", "Creative Freedom", "Modern Software & Hardware Provided", "Professional Growth", "Performance Bonuses"],
    },
    {
        id: "content-creator",
        title: "Content Creator",
        department: "Digital Media",
        type: "Full-time",
        location: "Delhi / Remote (Hybrid)",
        lastDate: "31 March 2026",
        badge: "New",
        badgeColor: "blue",
        shortDescription: "Join our creative team as a Content Creator and help us build a strong, engaging, and impactful digital presence for RK Institution across all platforms.",
        aboutRole: "As a Content Creator at RK Institution, you will be responsible for planning, writing, and producing content across platforms such as Instagram, YouTube, Facebook, and our website. You'll draft engaging posts, write blogs, script videos, and craft narratives that connect with students, parents, and the academic community.",
        responsibilities: [
            "Create engaging content for Instagram, Facebook, YouTube, and LinkedIn on a regular posting schedule.",
            "Write scripts for educational reels, explainer videos, and promotional campaigns.",
            "Draft blogs, newsletters, and website copy that reflects our institution's brand voice.",
            "Research trending topics in education and translate them into compelling content ideas.",
            "Coordinate with the Video Editor to produce multimedia content packages.",
            "Manage the content calendar and ensure timely content publishing.",
            "Monitor analytics and adjust content strategy based on performance insights.",
        ],
        qualifications: [
            "Bachelor's degree in Mass Communication, Journalism, Marketing, or related field.",
            "1+ year experience in content creation, digital marketing, or copywriting.",
            "Exceptional written communication in Hindi and English.",
            "Creative mindset with the ability to generate fresh, platform-native ideas.",
            "Familiarity with Canva or basic design tools is a plus.",
            "Knowledge of SEO and social media algorithms preferred.",
        ],
        skills: ["Copywriting", "SEO", "Social Media Strategy", "Canva", "Content Calendar", "Hindi & English Writing"],
        salaryRange: "₹15,000 – ₹28,000/month",
        perks: ["Hybrid Work Model", "Creative Autonomy", "Skill Development Courses", "Performance Bonuses", "Team-First Culture"],
    },
];
