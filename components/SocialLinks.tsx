import React from 'react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TiktokIcon, TwitchIcon } from './SocialIcons';

interface SocialLinksProps {
  variant: 'project';
  links: {
    instagram?: string | null;
    facebook?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    twitch?: string | null;
  };
}

export default function SocialLinks({ variant, links }: SocialLinksProps) {
  const hasLinks = Object.values(links).some(url => url && url.trim() !== '');

  if (!hasLinks) return null;

  if (variant === 'project') {
    return (
      <div className="flex items-center gap-2 border-l border-k-stone/20 pl-4 md:flex">
        {links.instagram && (
          <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all" title="Instagram">
            <InstagramIcon size={16} className="text-k-stone/70 group-hover:text-pink-400 transition-colors" />
          </a>
        )}
        {links.youtube && (
          <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all" title="YouTube">
            <YoutubeIcon size={16} className="text-k-stone/70 group-hover:text-red-500 transition-colors" />
          </a>
        )}
        {links.tiktok && (
          <a href={links.tiktok} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all" title="TikTok">
            <TiktokIcon size={16} className="text-k-stone/70 group-hover:text-cyan-400 transition-colors" />
          </a>
        )}
        {links.twitch && (
          <a href={links.twitch} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all" title="Twitch">
            <TwitchIcon size={16} className="text-k-stone/70 group-hover:text-purple-400 transition-colors" />
          </a>
        )}
        {links.facebook && (
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="group p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all" title="Facebook">
            <FacebookIcon size={16} className="text-k-stone/70 group-hover:text-blue-500 transition-colors" />
          </a>
        )}
      </div>
    );
  }

  return null;
}
