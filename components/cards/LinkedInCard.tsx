import { LinkedInProfile } from '@/lib/scraper-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, GraduationCap, Users, Linkedin } from 'lucide-react';
import { IconGlow } from '@/components/ui/PremiumAnimations';

export function LinkedInCard({ profile }: { profile: LinkedInProfile }) {
    if (!profile) return null;

    return (
        <Card className="bg-background/40 backdrop-blur-xl border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center gap-3 mb-2">
                    <IconGlow icon={<Linkedin className="w-5 h-5 text-[#0077b5]" />} color="primary" />
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        LinkedIn Profile
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {profile.image && (
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0077b5]/20 overflow-hidden shrink-0 shadow-xl">
                            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="space-y-2 flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{profile.name}</h2>
                        <p className="text-lg text-[#0077b5] font-medium leading-tight">{profile.headline}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                            {profile.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.connections && (
                                <div className="flex items-center gap-1.5 text-white/80">
                                    <Users className="w-4 h-4" />
                                    <span>{profile.connections} connections</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* About Section */}
                {profile.about && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">About</h4>
                        <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap line-clamp-6 hover:line-clamp-none transition-all">
                            {profile.about}
                        </p>
                    </div>
                )}

                {/* Experience & Education Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Experience */}
                    {profile.experience.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                <Briefcase className="w-4 h-4" /> Experience
                            </h4>
                            <div className="space-y-3">
                                {profile.experience.slice(0, 3).map((job, i) => (
                                    <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-[#0077b5]/30 transition-colors">
                                        <div className="font-medium text-white">{job.title}</div>
                                        <div className="text-sm text-[#0077b5]">{job.company}</div>
                                        {(job.duration || job.location) && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {job.duration} {job.location && `• ${job.location}`}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {profile.education.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                <GraduationCap className="w-4 h-4" /> Education
                            </h4>
                            <div className="space-y-3">
                                {profile.education.slice(0, 2).map((edu, i) => (
                                    <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-[#0077b5]/30 transition-colors">
                                        <div className="font-medium text-white">{edu.school}</div>
                                        <div className="text-sm text-muted-foreground">{edu.degree}</div>
                                        {edu.duration && <div className="text-xs text-muted-foreground/60 mt-1">{edu.duration}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
