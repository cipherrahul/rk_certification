import { getPublicTeachers } from "@/app/actions/teacher-portal";
import { GraduationCap, BookOpen, Award, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
    title: "Our Faculty | RK Institute",
    description: "Meet our experienced and dedicated team of teachers and faculty members.",
};

export default async function FacultyPage() {
    const teachers = await getPublicTeachers();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 py-24 text-center">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="relative container mx-auto px-4">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                        <GraduationCap className="w-4 h-4" /> Expert Faculty
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                        Meet Our <span className="text-indigo-300">Teachers</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-xl mx-auto">
                        Dedicated educators with years of experience, guiding students toward academic excellence.
                    </p>
                </div>
            </section>

            {/* Faculty Grid */}
            <section className="container mx-auto px-4 py-20">
                {(!teachers || teachers.length === 0) ? (
                    <div className="text-center text-slate-400 py-20 text-lg">Faculty profiles coming soon.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {teachers.map((teacher: any) => (
                            <div key={teacher.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-indigo-100">
                                {/* Photo */}
                                <div className="relative h-52 bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center overflow-hidden">
                                    {teacher.photo_url ? (
                                        <img src={teacher.photo_url} alt={teacher.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 text-3xl font-black flex items-center justify-center">
                                            {teacher.name[0]}
                                        </div>
                                    )}
                                    {/* Department badge */}
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-white/90 text-indigo-700 shadow-sm text-xs font-semibold border-0">
                                            {teacher.department}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-lg font-black text-slate-900 leading-tight">{teacher.name}</h3>
                                    <p className="text-indigo-600 font-semibold text-sm mt-0.5">{teacher.subject}</p>

                                    {teacher.bio && (
                                        <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3">{teacher.bio}</p>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3 text-xs text-slate-500">
                                        {teacher.qualification && (
                                            <div className="flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                                <span className="truncate">{teacher.qualification}</span>
                                            </div>
                                        )}
                                    </div>
                                    {teacher.experience && (
                                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{teacher.experience} yrs experience</span>
                                        </div>
                                    )}
                                    {teacher.assigned_class && (
                                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>Teaching: {teacher.assigned_class}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
