import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <nav
        className="flex justify-between items-center px-8 py-2"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <img src="/lyra-transparent.png" height={32} width={64}></img>
        <ul className="flex space-x-8 items-center text-sm font-medium">
          <li>
            <HoverCard>
              <HoverCardTrigger asChild>
                <a 
                  href="#" 
                  className="hover:underline transition-all duration-300 hover:text-white hover:translate-y-[-2px]"
                >
                  Pricing
                </a>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Pricing Plans</h4>
                  <p className="text-sm text-muted-foreground">
                    Always free! Lyra's BYOAK (Bring your own API Key) allows you to use the models you want to use. <br></br><br></br> Lyra is currently most compatible with CloudFlare Workers AI as it provides a generous free-tier limit giving you around 100+ prompts DAILY on 1400-token I/O context.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </li>
          <li>
            <HoverCard>
              <HoverCardTrigger asChild>
                <a 
                  href="#" 
                  className="hover:underline transition-all duration-300 hover:text-white hover:translate-y-[-2px]"
                >
                  Features
                </a>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Powerful Features</h4>
                  <p className="text-sm text-muted-foreground">
                    Full feauture list to come soon!
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </li>
          <li>
            <HoverCard>
              <HoverCardTrigger asChild>
                <a 
                  href="#" 
                  className="hover:underline transition-all duration-300 hover:text-white hover:translate-y-[-2px]"
                >
                  FAQ
                </a>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">FAQ</h4>
                  <p className="text-sm text-muted-foreground">
                    Coming soon!
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </li>
          <li>
            <Button> In Development </Button>
          </li>
        </ul>
      </nav>

      {/* Rest of your component remains the same */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -top-20">
        <img src="/animation2-hero.gif" className="w-100 h-100 object-cover"></img>
      </div>

      <div className="absolute bottom-0 left-0 p-10 flex flex-col items-start z-10 max-w-lg">
        <img src="/lyra-transparent.png" height={32} width={64}></img>
        <h1 className="text-3xl md:text-4xl font-regular mb-3 leading-tight">
          Privacy-First Cloud IDE for Modern Developers
        </h1>
        <p className="mb-6 text-sm max-w-sm opacity-80">
          Open-source, private, powerful. The new way to code in the cloud without compromising your data.
        </p>
        <a href="/waitlist">
          <Button className="hover:cursor-pointer">Join Waitlist</Button>
        </a>
      </div>
    </div>
  );
}
