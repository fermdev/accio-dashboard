import React from 'react';
import acsIcon from '../assets/acsicon.png';

const Campaigns = () => {
  const campaigns = [
    {
      id: 2,
      title: "Celebrate Accio Launch",
      description: "To celebrate the launch, we are kicking off a one-week campaign with 100K $ACS shared between 2 creators and 2 subscribers!",
      status: ["ACTIVE", "LAUNCH"],
      type: "SOCIAL",
      rewardPool: "100,000",
      deadline: "7 Days Left",
      url: "https://x.com/accio_access/status/2034553128285352408",
      avatars: ["🚀", "🎉"]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark/90 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-left">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
            Your Gateway to <span className="text-primary italic">Earn</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Don't miss out on exclusive ecosystem opportunities. Participate in active campaigns to earn $ACS, $SOL, $USDC, and various other rewards.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 flex flex-col gap-6 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight leading-tight max-w-[70%]">
                  {campaign.title}
                </h3>
                <div className="flex -space-x-2">
                  {campaign.avatars.map((emoji, i) => (
                    <div 
                      key={i} 
                      className="size-8 rounded-full bg-slate-100 dark:bg-white/10 border-2 border-white dark:border-slate-900 flex items-center justify-center text-sm shadow-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {campaign.status.map((tag) => (
                  <span 
                    key={tag}
                    className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                      tag === 'ACTIVE' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : tag === 'UPCOMING'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed italic">
                {campaign.description}
              </p>

              {/* Details Panel */}
              <div className="bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-3xl p-4 grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Reward Pool</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm text-slate-900 dark:text-white uppercase">{campaign.rewardPool}</p>
                    <img src={acsIcon} alt="ACS" className="h-3.5 w-auto object-contain" />
                  </div>
                </div>
                <div className="space-y-1 border-l border-slate-200 dark:border-white/10 pl-4">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Deadline</p>
                  <p className="text-sm text-slate-900 dark:text-white">{campaign.deadline}</p>
                </div>
              </div>

              {/* CTA */}
              <a 
                href={campaign.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl uppercase tracking-widest text-xs text-center hover:bg-primary dark:hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-lg group-hover:scale-[1.02]"
              >
                View on X
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
