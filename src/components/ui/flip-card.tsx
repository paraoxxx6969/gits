import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Code2, Rocket, Zap, UserCheck, ExternalLink } from 'lucide-react';
import type { CrewMember } from '../../types';

// Custom SVG Icons for LinkedIn & GitHub for reliability
const LinkedInIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GitHubIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  color?: string;
  img?: string;
  linkedin?: string;
  github?: string;
  member?: CrewMember;
}

export default function CardFlip({
  title = 'Build MVPs Fast',
  subtitle = 'Launch your idea in record time',
  description = 'Copy, paste, customize—and launch your MVP faster than ever with our developer-first component library.',
  features = [
    'Copy & Paste Ready',
    'Developer-First',
    'MVP Optimized',
    'Zero Setup Required',
  ],
  color = '#00f2fe',
  img,
  linkedin,
  github,
  member
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Extract props if member object is passed
  const displayTitle = member?.name || title;
  const displaySubtitle = member?.role || subtitle;
  const displayDescription = member?.bio || description;
  const displayFeatures = member?.features || features;
  const displayImg = member?.img || img;
  const displayLinkedin = member?.linkedin || linkedin;
  const displayGithub = member?.github || github;

  return (
    <div
      style={{
        ['--primary' as any]: color ?? '#00f2fe',
      }}
      className="group relative h-[380px] w-full max-w-[320px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(0deg)] [backface-visibility:hidden]',
            'overflow-hidden rounded-2xl',
            'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800',
            'border border-slate-700/50 dark:border-zinc-800/50',
            'shadow-lg dark:shadow-xl',
            'transition-all duration-700',
            'group-hover:shadow-2xl',
            'group-hover:border-cyan-500/40',
            isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          {/* Background Photo or Gradient */}
          {displayImg ? (
            <div className="absolute inset-0 h-full w-full overflow-hidden">
              <img 
                src={displayImg} 
                alt={displayTitle} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>
          ) : (
            <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/10" />
          )}

          {/* Top Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-950/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/30 shadow-md">
              <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Hover for Info</span>
            </div>
          </div>

          {/* Bottom content overlay */}
          <div className="absolute right-0 bottom-0 left-0 p-5 z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                  {displayTitle}
                </h3>
                <p className="text-sm font-medium text-cyan-400 drop-shadow">
                  {displaySubtitle}
                </p>
              </div>
              <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400 border border-cyan-500/40 backdrop-blur-sm">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-2xl p-5',
            'bg-gradient-to-br from-slate-900 via-slate-900/98 to-slate-950',
            'border border-cyan-500/30',
            'shadow-xl',
            'flex flex-col justify-between',
            'transition-all duration-700',
            !isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          {/* Background Subtle Gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {displayTitle}
                </h3>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Crew Details
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                {displaySubtitle}
              </p>
            </div>

            {/* Bio / Description */}
            <p className="text-xs leading-relaxed text-slate-300 line-clamp-3 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
              {displayDescription}
            </p>

            {/* Tech Skills / Features list */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Highlights & Focus
              </span>
              <div className="space-y-1.5">
                {displayFeatures.slice(0, 3).map((feature, index) => {
                  const icons = [Code2, Rocket, Zap];
                  const IconComponent = icons[index % icons.length];

                  return (
                    <div
                      key={feature + index}
                      className="flex items-center gap-2.5 text-xs text-slate-200"
                      style={{
                        transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                        opacity: isFlipped ? 1 : 0,
                        transition: 'all 0.4s ease',
                        transitionDelay: `${index * 80 + 150}ms`,
                      }}
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <IconComponent className="h-3 w-3" />
                      </div>
                      <span className="font-medium truncate">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Social Links Footer */}
          <div className="relative z-10 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {displayLinkedin ? (
                <a
                  href={displayLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/40 text-blue-400 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <LinkedInIcon className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              ) : (
                <div className="flex-1 py-2 px-3 rounded-lg bg-slate-800/40 text-slate-500 text-xs text-center border border-slate-800">
                  No LinkedIn
                </div>
              )}

              {displayGithub ? (
                <a
                  href={displayGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <GitHubIcon className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              ) : (
                <div className="flex-1 py-2 px-3 rounded-lg bg-slate-800/40 text-slate-500 text-xs text-center border border-slate-800">
                  No GitHub
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
