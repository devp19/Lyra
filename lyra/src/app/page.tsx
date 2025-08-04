import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <nav className="flex justify-between items-center px-8 py-2" style={{borderBottom: "1px solid rgba(255, 255, 255, 0.1)"}}>
        <img src="/lyra-transparent.png" height={32} width={64}></img>
        <ul className="flex space-x-8 items-center text-sm font-medium">
          <li><a href="#" className="hover:underline">How it works</a></li>
          <li><a href="#" className="hover:underline">FAQ</a></li>
          <li>
            <Button> Join Waitlist </Button>
          </li>
        </ul>
      </nav>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/globe.png"
          alt="Globe animation"
          width={520}
          height={520}
          className=""
          priority
        />
      </div>

      <div className="absolute bottom-0 left-0 p-10 flex flex-col items-start z-10 max-w-lg">
        <h1 className="text-3xl md:text-4xl font-regular mb-3 leading-tight">
          Privacy-First Cloud IDE for Modern Developers
        </h1>
        <p className="mb-6 text-sm max-w-sm opacity-80">
          Open-source, private, powerful. This is Lyra.
        </p>
        <Button>Join Waitlist</Button>
      </div>
    </div>
  );
}
