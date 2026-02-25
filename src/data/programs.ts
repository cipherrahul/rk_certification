import {
    BookOpen,
    GraduationCap,
    Lightbulb,
    Scale,
    Star,
    TrendingUp,
    Zap,
    CheckCircle2,
    Atom,
    LucideIcon,
    Globe,
    Laptop,
    ShieldCheck
} from 'lucide-react';

export type ProgramCategory = 'Academic' | 'Competitive' | 'Entrance' | 'Professional';

export interface FAQ {
    question: string;
    answer: string;
}

export interface CurriculumModule {
    moduleTitle: string;
    topics: string[];
}

export interface Program {
    slug: string;
    title: string;
    category: ProgramCategory;
    target: string;
    subjects: string[];
    duration: string;
    mode: 'Offline' | 'Hybrid' | 'Online';
    description: string;
    detailedDescription: string;
    icon: LucideIcon;
    highlight: string;
    curriculum: string[];
    fullCurriculum: CurriculumModule[];
    features: string[];
    outcomes: string[];
    faq: FAQ[];
    fees?: string;
}

export const PROGRAMS: Program[] = [
    {
        slug: 'primary-foundation',
        title: 'Primary Foundation',
        category: 'Academic',
        target: 'Class 1–8',
        subjects: ['Mathematics', 'Science', 'English', 'EVS'],
        duration: 'Academic Session',
        mode: 'Offline',
        description: 'Nurturing young minds with a strong focus on conceptual clarity and activity-based learning.',
        detailedDescription: 'Our Primary Foundation program is meticulously designed for students in classes 1 to 8. We believe that these formative years are critical for developing a lifelong love for learning. Our approach moves away from rote memorization, focusing instead on "Learning by Doing." Through interactive sessions, digital aids, and regular practical applications, we ensure that students build an unshakable foundation in core subjects while developing critical thinking and logical reasoning skills.',
        icon: Lightbulb,
        highlight: 'Strong Foundation',
        curriculum: ['Mental Math foundation', 'Grammar and Fluency', 'Basic Science concepts', 'Interactive EVS'],
        fullCurriculum: [
            {
                moduleTitle: 'Foundational Mathematics',
                topics: ['Mental Math techniques', 'Number systems & Logic', 'Basic Geometry through shapes', 'Practical word problems']
            },
            {
                moduleTitle: 'Scientific Query',
                topics: ['Nature & Environment', 'Daily life Science', 'Simple experiments', 'Critical observation skills']
            },
            {
                moduleTitle: 'Language Mastery',
                topics: ['Phonetics & Pronunciation', 'Grammar essentials', 'Creative writing', 'Storytelling & Public speaking']
            }
        ],
        features: ['Activity-based learning', 'Weekly doubt sessions', 'Regular parent-teacher updates', 'Focus on logic building'],
        outcomes: ['Strong academic base', 'Enhanced curiosity', 'Preparation for secondary education'],
        faq: [
            { question: 'What is the teacher-student ratio?', answer: 'We maintain a healthy 1:20 ratio to ensure personalized attention for every child.' },
            { question: 'Do you provide study materials?', answer: 'Yes, we provide specialized booklets and digital resources tailored for young learners.' },
            { question: 'How often are the tests conducted?', answer: 'We conduct informal weekly assessments and a detailed monthly progress test.' },
            { question: 'Is there any focus on extra-curriculars?', answer: 'While we focus on academics, we integrate creative activities like storytelling and science experiments into the curriculum.' }
        ],
        fees: 'Monthly: ₹2,500 | Quarterly: ₹7,000'
    },
    {
        slug: 'secondary-excellence',
        title: 'Secondary Excellence',
        category: 'Academic',
        target: 'Class 9–10',
        subjects: ['Physics', 'Chemistry', 'Math', 'Biology', 'SST'],
        duration: '1 Year Program',
        mode: 'Offline',
        description: 'Expert-led preparation focusing on Board Exams and deep subject-specific training.',
        detailedDescription: 'Classes 9 and 10 are the gateway to clinical academic success. Our Secondary Excellence program offers a rigorous, board-aligned curriculum that helps students navigate the complexities of high school Science and Mathematics. We emphasize conceptual depth, rigorous testing, and exam-taking strategies that have consistently produced top-rankers in state and national boards.',
        icon: BookOpen,
        highlight: 'Board Focused',
        curriculum: ['NCERT Depth coverage', 'Sample paper workshops', 'Formula & Concept mapping', 'Regular Mock Tests'],
        fullCurriculum: [
            {
                moduleTitle: 'Pure Sciences (Physics & Chemistry)',
                topics: ['Numerical problem solving', 'Chemical reactions & equations', 'Conceptual Physics', 'Laboratory demonstrations']
            },
            {
                moduleTitle: 'Mathematics Mastery',
                topics: ['Algebra & Trigonometry', 'Statistical analysis', 'Proofs & Theorems', 'High-speed calculation']
            },
            {
                moduleTitle: 'Social Studies & Language',
                topics: ['Analytical History/Geography', 'Civics & Economics', 'Writing skills', 'Literature analysis']
            }
        ],
        features: ['Specialized Science & Math focus', 'Exam strategy sessions', 'Chapter-wise test series', 'Detailed performance analytics'],
        outcomes: ['High board scoring', 'Solid base for Senior Secondary', 'Time management skills'],
        faq: [
            { question: 'Is it aligned with CBSE/ICSE?', answer: 'Yes, our modules are updated every year to align perfectly with the latest CBSE/ICSE and State Board patterns.' },
            { question: 'Are there extra classes for difficult topics?', answer: 'Absolutely. We schedule specialized "Booster sessions" for topics that students find challenging.' },
            { question: 'Do you provide NTSE preparation?', answer: 'Yes, we provide integrated training for NTSE and other scholarship exams within this program.' }
        ],
        fees: 'Monthly: ₹3,500 | Annual: ₹38,000'
    },
    {
        slug: 'senior-secondary',
        title: 'Senior Secondary',
        category: 'Academic',
        target: 'Class 11–12',
        subjects: ['PCM', 'PCB', 'Commerce', 'Humanities'],
        duration: '2 Year Integrated',
        mode: 'Hybrid',
        description: 'Integrated approach for Board excellence and preliminary entrance exam preparation.',
        detailedDescription: 'Class 11 & 12 are decisive years. Our program combines Board preparation with entrance exam orientation, helping students manage their school curriculum while building a strong base for competitive exams like JEE, NEET, or CUET. We offer stream-wise specialized guidance with a focus on deep conceptual understanding.',
        icon: GraduationCap,
        highlight: 'Integrated Prep',
        curriculum: ['Stream-wise specialization', 'Advanced concept training', 'Board-integrated tutorials', 'Career counseling'],
        fullCurriculum: [
            {
                moduleTitle: 'Core Subject Specialization',
                topics: ['In-depth conceptual lectures', 'Advanced numerical & theoretical applications', 'NCERT revision rounds', 'Board-pattern mock exams']
            },
            {
                moduleTitle: 'Entrance Foundation',
                topics: ['Basic to intermediate MCQ strategy', 'Competitive logical reasoning', 'Previous Year Questions (PYQ) analysis', 'Subjective vs Objective balance']
            },
            {
                moduleTitle: 'Skill & Career Guidance',
                topics: ['Career path counseling', 'Personality development workshops', 'Admission process guidance', 'Stress management sessions']
            }
        ],
        features: ['Integrated Entrance coaching', 'Stream-specific labs', 'Flexible hybrid batches', 'Personality development'],
        outcomes: ['Stream mastery', 'College entrance readiness', 'Top Board results'],
        faq: [
            { question: 'Can I switch between online and offline?', answer: 'Yes, our Hybrid model allows you to attend classes as per your convenience and recorded sessions are provided for revision.' },
            { question: 'Do you provide separate material for Boards and Entrance?', answer: 'Yes, we provide "Board Master" booklets for subjective exams and "Speed Pulse" modules for competitive patterns.' }
        ],
        fees: 'Annual: ₹65,000 | Installments: ₹6,000/month'
    },
    {
        slug: 'jee-ultimate',
        title: 'JEE Preparation',
        category: 'Entrance',
        target: 'Class 11, 12 & Droppers',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        duration: '1/2 Year Intensive',
        mode: 'Offline',
        description: 'The ultimate rank-improvement strategy for JEE Main & Advanced with India\'s best mentors.',
        detailedDescription: 'Cracking JEE requires more than just intelligence—it needs strategy, discipline, and the right guidance. Our JEE Ultimate program is led by a team of IITians and senior academicians. We provide a competitive ecosystem, advanced problem-solving techniques, and a multi-layered testing system that prepares students for the toughest engineering entrance exam in the world.',
        icon: Zap,
        highlight: 'Rank Focused',
        curriculum: ['Concept to Advanced application', 'Daily Practice Problems (DPP)', 'All India Test Series (AITS)', 'Previous Year analytics'],
        fullCurriculum: [
            {
                moduleTitle: 'Advanced Physics',
                topics: ['Mechanics & Electrodynamics', 'Modern Physics', 'Optics & Thermodynamics', 'Problem solving for Advanced']
            },
            {
                moduleTitle: 'Organic & Inorganic Chemistry',
                topics: ['Mechanism-based study', 'Periodic properties', 'Physical Chemistry Numericals', 'NCERT revision rounds']
            },
            {
                moduleTitle: 'Calculus & Coordinate Geometry',
                topics: ['Complex Numbers', 'Differential & Integral Calculus', 'Three-dimensional Geometry', 'Logical shortcuts']
            }
        ],
        features: ['Doubt-clearing counters', 'Personalized mentor tracking', 'Focus on speed & accuracy', 'Peer-to-peer competition'],
        outcomes: ['NIT/IIT Admission', 'Advanced Problem Solving', 'Nationwide ranking'],
        faq: [
            { question: 'What is the frequency of Mock Tests?', answer: 'Students undergo a part-syllabus test every fortnight and a full-length All India Mock Test every month.' },
            { question: 'Do you provide study material for Advanced?', answer: 'Yes, we have a specialized "Advanced Workbook" series focusing on multi-concept problems.' },
            { question: 'Is there a dropper-specific batch?', answer: 'Yes, we have an intensive "Repeater\'s Ranker Batch" starting June every year.' }
        ],
        fees: '1-Year: ₹85,000 | 2-Year: ₹1,50,000'
    },
    {
        slug: 'neet-medical',
        title: 'NEET Foundation',
        category: 'Entrance',
        target: 'Class 11, 12 & Droppers',
        subjects: ['Biology (Botany + Zoology)', 'Physics', 'Chemistry'],
        duration: '1/2 Year Program',
        mode: 'Offline',
        description: 'Rigorous medical entrance coaching with heavy emphasis on NCERT and critical thinking.',
        detailedDescription: 'Excellence in NEET requires an absolute mastery over NCERT. Our NEET Foundation program focuses on diagram-based learning, mnemonics for memorizing complex Biological terms, and extensive practice on assertion-reasoning type questions. We ensure students are not just learning, but retaining information for high-speed recall during the exam.',
        icon: Atom,
        highlight: 'NCERT Centric',
        curriculum: ['Exhaustive NCERT drill', 'Diagrammatic memory techniques', 'Mock exam simulations', 'Physical & Organic weightage'],
        fullCurriculum: [
            {
                moduleTitle: 'Biological Sciences (Botany & Zoology)',
                topics: ['Plant & Human Physiology', 'Genetics & Evolution', 'Biotechnology & Ecology', 'Structural organization in animals/plants']
            },
            {
                moduleTitle: 'Medical Physics & Chemistry',
                topics: ['Conceptual numericals', 'Reaction mechanisms & Periodic trends', 'Modern Physics for NEET', 'Physical Chemistry basics']
            },
            {
                moduleTitle: 'NCERT Intensive Drill',
                topics: ['Page-by-page NCERT review', 'Diagram identification sessions', 'Scientific names mnemonics', 'Previous 30-year papers']
            }
        ],
        features: ['Special Biology workshops', 'Timed test series', 'Psychological counseling', 'Rank improvement batch'],
        outcomes: ['MBBS/BDS Admission', 'Deep Biological understanding', 'National level competency'],
        faq: [
            { question: 'Do you cover AIIMS level questions?', answer: 'Yes, our material and tests cover the difficulty levels of all top medical institutes including AIIMS and JIPMER (integrated in NEET).' },
            { question: 'Is there a focus on Physics for Medical students?', answer: 'Yes, we have specialized "Physics for Bio" modules that simplify complex mathematical applications for medical aspirants.' }
        ],
        fees: 'Annual: ₹90,000 | 2-Year: ₹1,60,000'
    },
    {
        slug: 'olympiad-champions',
        title: 'Olympiad Training',
        category: 'Competitive',
        target: 'Class 6–10',
        subjects: ['Science', 'Math', 'Cyber', 'English'],
        duration: 'Semester Based',
        mode: 'Online',
        description: 'Sharpening logical and analytical skills to excel in National and International Olympiads.',
        detailedDescription: 'Olympiads are about logical flexibility and deeper application of simple concepts. This program trains students to think outside the box and compete at the national and international levels. We focus on building an analytical mindset that helps students solve problems they’ve never seen before.',
        icon: Star,
        highlight: 'Gold Medal Focus',
        curriculum: ['SOF/Silverzone syllabus', 'Logical reasoning drills', 'Past Olympiad papers', 'Competitive mock exams'],
        fullCurriculum: [
            {
                moduleTitle: 'Logical & Analytical Reasoning',
                topics: ['Verbal & Non-verbal reasoning', 'Pattern recognition & Series', 'Abstract thinking & Puzzles', 'Matrix & Grid logic']
            },
            {
                moduleTitle: 'Subject Excellence (Math & Science)',
                topics: ['Applied Physics/Chemistry concepts', 'Advanced Arithmetic & Geometry', 'Biological classification depth', 'Scientific method application']
            },
            {
                moduleTitle: 'Competitive Simulation',
                topics: ['Speed-based practice rounds', 'Strategy for negative marking', 'Analysis of tricky questions', 'Olympiad mock tests']
            }
        ],
        features: ['Focus on extra-NCERT topics', 'Analytical mindset building', 'Expert doubt clearing', 'Performance leaderboard'],
        outcomes: ['Medals & Certifications', 'Logic development', 'Early competitive edge'],
        faq: [
            { question: 'Which Olympiads are covered?', answer: 'We cover NSO, IMO, NCO, and IEO by SOF, as well as Silverzone Olympiads and Unified Council exams.' },
            { question: 'Is this helpful for NTSE?', answer: 'Yes, the logical reasoning and deep subject focus provide an excellent preview for NTSE preparation.' }
        ],
        fees: 'Semester: ₹12,000 | Full Year: ₹20,000'
    },
    {
        slug: 'cuet-success',
        title: 'CUET Preparation',
        category: 'Entrance',
        target: 'Class 12 Students',
        subjects: ['Domain Subjects', 'General Test', 'Language'],
        duration: '6 Months Crash',
        mode: 'Hybrid',
        description: 'Fast-track your admission to top Central Universities with our expert CUET module.',
        detailedDescription: 'CUET is the single-window entry to top universities like DU, JNU, and BHU. Our module ensures you score 100 percentile in your domain subjects while mastering the General Test and Language segments. We provide a structured roadmap that balances board exams and CUET prep.',
        icon: CheckCircle2,
        highlight: 'Uni Admission',
        curriculum: ['Domain specialization', 'Quantitative aptitude', 'General awareness', 'Reading comprehension'],
        fullCurriculum: [
            {
                moduleTitle: 'Domain Specialization (Section II)',
                topics: ['Subject-specific MCQ drills', 'NCERT-based deep revision', 'Mapping domain topics to CUET pattern', 'Advanced practice for 40/50 target']
            },
            {
                moduleTitle: 'General Test (Section III)',
                topics: ['Quantitative reasoning', 'Mental ability short-tricks', 'Daily Current Affairs', 'General Knowledge modules']
            },
            {
                moduleTitle: 'Language Proficiency (Section I)',
                topics: ['Reading comprehension speed', 'Vocabulary building', 'Grammatical accuracy', 'Para-jumbles and Logic']
            }
        ],
        features: ['Mock test simulation', 'University guidance', 'Current affairs updates', 'Short-cut techniques'],
        outcomes: ['DU/BHU/JNU Admission', 'Aptitude mastery', 'Strategic entrance prep'],
        faq: [
            { question: 'Is the material according to NTA?', answer: 'Yes, our material follows the NTA syllabus and test pattern strictly, including the latest CBT mode simulations.' },
            { question: 'Do you help with University/Course selection?', answer: 'Yes, we have a dedicated counseling session to help you choose the best university and domain combinations based on your goals.' }
        ],
        fees: 'Crash Course: ₹25,000 | Regular: ₹40,000'
    },
    {
        slug: 'general-competitive',
        title: 'General Competitive',
        category: 'Competitive',
        target: 'Graduates & Aspiring candidates',
        subjects: ['Aptitude', 'Reasoning', 'English', 'GS'],
        duration: 'Flexible',
        mode: 'Hybrid',
        description: 'Comprehensive coaching for SSC, Banking, and State Exams focusing on speed and accuracy.',
        detailedDescription: 'For those looking for a secure career in the government sector, we offer specialized coaching for SSC (CGL, CHSL), Banking (IBPS, SBI PO), and various State government exams. Our methodology focus on mental math, logical shortcuts, and a massive repository of practice questions.',
        icon: TrendingUp,
        highlight: 'Career Launch',
        curriculum: ['Math short-tricks', 'Logical reasoning puzzles', 'Business English', 'General Studies modules'],
        fullCurriculum: [
            {
                moduleTitle: 'Quantitative Aptitude mastery',
                topics: ['Shortcut methods for Arithmetic', 'Data interpretation techniques', 'Speed Math & Mental calculation', 'Algebra & Geometry for SSC']
            },
            {
                moduleTitle: 'Reasoning & Intelligence',
                topics: ['Verbal & Non-verbal reasoning', 'Syllogism and Blood relations', 'Puzzles for Bank PO', 'Coding-Decoding logic']
            },
            {
                moduleTitle: 'GS & Current Affairs',
                topics: ['Static GK repository', 'History, Geography & Polity', 'Daily current affairs analysis', 'Economic awareness for Banking']
            }
        ],
        features: ['Daily speed tests', 'Live recorded sessions', 'Interview prep', 'Self-study materials'],
        outcomes: ['Government Job placement', 'Professional competency', 'Interview success'],
        faq: [
            { question: 'Do you provide mock interview prep?', answer: 'Yes, we conduct mock interviews and grooming sessions for all students who qualify the written tiers.' },
            { question: 'Is there a specific batch for Bank PO?', answer: 'Yes, we have dedicated Banking batches that focus exclusively on IBPS and SBI patterns.' }
        ],
        fees: 'Monthly: ₹1,500 | Lifetime: ₹18,000'
    },
    {
        slug: 'full-stack-web',
        title: 'Full Stack Development',
        category: 'Professional',
        target: 'College Students & Job Seekers',
        subjects: ['Frontend (React)', 'Backend (Node.js)', 'Database (PostgreSQL)', 'DevOps'],
        duration: '6 Months',
        mode: 'Hybrid',
        description: 'Master modern web development from scratch with project-based learning and placement support.',
        detailedDescription: 'The tech industry values skills over degrees. Our Full Stack Development program is a hands-on bootcamp designed to take you from hello-world to building complex production-grade applications. You will learn the PERN stack (PostgreSQL, Express, React, Node) and master modern tools like Git, Docker, and AWS, all while being mentored by senior software engineers.',
        icon: Globe,
        highlight: 'Job Ready',
        curriculum: ['HTML/CSS/JS Mastery', 'React & Next.js Frameworks', 'REST & GraphQL APIs', 'Deployment & Cloud basics'],
        fullCurriculum: [
            {
                moduleTitle: 'Frontend Engineering',
                topics: ['Responsive Design with Tailwind', 'React Hooks & State Management', 'Next.js 14 App Router', 'Animation with Framer Motion', 'UI Toolkits (Shadcn)']
            },
            {
                moduleTitle: 'Backend & Data Architecture',
                topics: ['Node.js & Express servers', 'PostgreSQL & ORMs (Prisma/Drizzle)', 'Authentication & JWT Security', 'Serverless Functions', 'Database Scaling']
            },
            {
                moduleTitle: 'Industry Standards & DevOps',
                topics: ['Git Version Control & PR reviews', 'CI/CD Pipelines (Github Actions)', 'AWS/Vercel Cloud Deployment', 'Portfolio & Resume Building', 'Open Source contributing']
            }
        ],
        features: ['Real-world capstone projects', 'Portfolio reviews', 'Mock technical interviews', '1-on-1 career mentorship'],
        outcomes: ['Software Engineer role', 'Full Stack proficiency', 'Industry-standard portfolio'],
        faq: [
            { question: 'Do you provide job assistance?', answer: 'Yes, we have a dedicated placement cell that partners with 50+ tech companies for hiring. We also help with LinkedIn and resume optimization.' },
            { question: 'Can non-tech students join?', answer: 'Absolutely. Over 40% of our successful alumni come from a non-CS background. We start from absolute basics.' },
            { question: 'Is the course project-based?', answer: 'Yes, you will build and deploy 3 major enterprise-level projects during the course.' }
        ],
        fees: 'One-time: ₹45,000 | EMI Available (₹5k/mo)'
    },
    {
        slug: 'data-science-ai',
        title: 'Data Science & AI',
        category: 'Professional',
        target: 'Graduates & Tech Professionals',
        subjects: ['Python', 'Machine Learning', 'Statistics', 'Deep Learning'],
        duration: '8 Months',
        mode: 'Online',
        description: 'Become a data professional by mastering AI, Machine Learning, and Big Data analytics.',
        detailedDescription: 'Data is the new oil. This program takes you deep into the world of Big Data and AI, ensuring you can generate insights and build predictive models that drive business decisions. From Python fundamentals to building Large Language Models, this course covers the entire spectrum of modern data science.',
        icon: TrendingUp,
        highlight: 'High Growth',
        curriculum: ['Python for Data Science', 'Statistical Modeling', 'ML Algorithms implementation', 'Neural Networks & NLP'],
        fullCurriculum: [
            {
                moduleTitle: 'Data Foundation & Statistics',
                topics: ['Python libraries (NumPy, Pandas, Polars)', 'Exploratory Data Analysis (EDA)', 'Statistical hypothesis testing', 'Linear Algebra for Data Science']
            },
            {
                moduleTitle: 'Machine Learning & Predictive Modeling',
                topics: ['Supervised & Unsupervised Learning', 'Regression & Classification', 'Ensemble methods (XGBoost)', 'Model evaluation & tuning']
            },
            {
                moduleTitle: 'Artificial Intelligence & Deep Learning',
                topics: ['Neural Networks with PyTorch/TensorFlow', 'Natural Language Processing (NLP)', 'Building Generative AI apps', 'Deploying models with MLOps']
            }
        ],
        features: ['Live industry datasets', 'GPU-powered labs', 'Research-oriented approach', 'AI project deployment'],
        outcomes: ['Data Scientist role', 'ML Engineer certification', 'Predictive modeling expertise'],
        faq: [
            { question: 'Do I need a strong Math background?', answer: 'Basic higher-secondary Math is helpful, but we cover necessary Statistics, Probability, and Linear Algebra from scratch.' },
            { question: 'Will I work on real data?', answer: 'Yes, all modules include labs using real-world datasets from finance, healthcare, and retail sectors.' }
        ],
        fees: 'Annual: ₹55,000 | Installments available'
    },
    {
        slug: 'adca-expert',
        title: 'Advanced Computer Diploma (ADCA)',
        category: 'Professional',
        target: 'Students & Office Staff',
        subjects: ['MS Office', 'Tally Prime', 'Photoshop', 'Internet/Web'],
        duration: '1 Year',
        mode: 'Offline',
        description: 'Comprehensive computer training covering office automation, accounting, and graphic design.',
        detailedDescription: 'The ADCA program is our most popular diploma for office and clerical career paths. It provides a 360-degree training on software that keeps modern businesses running. From complex Excel reporting to Tally Prime with GST, you will become the "go-to" computer expert for any organization.',
        icon: Laptop,
        highlight: 'Career Essential',
        curriculum: ['Advanced Excel & Word', 'Tally with GST', 'Basic Graphic Design', 'Cyber security basics'],
        fullCurriculum: [
            {
                moduleTitle: 'Office Automation & Typing',
                topics: ['English/Hindi Typing mastery', 'Advanced Excel (HLOOKUP/VLOOKUP/Macros)', 'Word for documentation', 'PowerPoint for premium presentations']
            },
            {
                moduleTitle: 'Accounting & Finance (Tally Prime)',
                topics: ['Booking Keeping basics', 'GST calculation & Filing', 'Inventory management', 'Payroll & Balance sheet reporting']
            },
            {
                moduleTitle: 'Creative & Digital Skills',
                topics: ['Photoshop for graphics', 'Basic Web Browsing & Security', 'Desktop Publishing basics', 'Hardware Troubleshooting basics']
            }
        ],
        features: ['Hands-on practical labs', 'Government recognized certificate', 'Focus on office productivity', 'Free typing software access'],
        outcomes: ['Office Administrator role', 'Accountant assistant', 'Computer proficiency certificate'],
        faq: [
            { question: 'Is the certificate valid for Govt jobs?', answer: 'Yes, our diploma is widely recognized for various government and private sector applications across India.' },
            { question: 'Is typing included in the course?', answer: 'Yes, we provide dedicated hours for typing speed improvement in both English and Hindi.' }
        ],
        fees: 'One-time: ₹12,000 | Monthly: ₹1,200'
    }
];
