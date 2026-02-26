import {
    BookOpen,
    GraduationCap,
    Lightbulb,
    Star,
    TrendingUp,
    Zap,
    CheckCircle2,
    Atom,
    Globe,
    Laptop,
    LucideProps
} from 'lucide-react';
import { ProgramIconName } from '@/data/programs';

const iconMap = {
    Lightbulb,
    BookOpen,
    GraduationCap,
    Zap,
    Atom,
    Star,
    CheckCircle2,
    TrendingUp,
    Globe,
    Laptop,
};

interface ProgramIconProps extends LucideProps {
    name: ProgramIconName;
}

export default function ProgramIcon({ name, ...props }: ProgramIconProps) {
    const IconComponent = iconMap[name];
    if (!IconComponent) return null;
    return <IconComponent {...props} />;
}
