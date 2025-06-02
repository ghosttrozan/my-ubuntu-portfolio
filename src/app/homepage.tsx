'use client';
import Image from "next/image";
import BrowserWindow from "./browserWindow";
import { useBrowserStore } from "../store/browserWindowStore";
import { useCalculatorStore } from "../store/calculatorWindowStore";
import { useAboutMeStore } from "../store/aboutMeWindow";
import { useTerminalStore } from "../store/terminalWindow";
import { useVsCodeStore } from "../store/vsCodeWindow";
import { useSpotifyStore } from "../store/spotifyWindow";
import {useWallpaperStore}  from "../store/wallpaperStore";
import { useSettingStore } from '../store/settingWindow'
import { useContactStore } from '../store/contactMe';
import CalculatorWindow from "./calcutaorWindow";
import AboutMeWindow from "./aboutMeWindow";
import TerminalWindow from "./terminalWindow";
import VSCodeWindow from "./vsCodeWindow";
import SpotifyWindow from "./spotifyWindow";
import SettingsWindow from "./settingWindow";
import ContactWindow from "./contactWindow";
import Visitors from "@/components/trackVisitor";

export default function HomePage() {
  const { isBrowserOpen } = useBrowserStore();
  const { isCalculatorOpen } = useCalculatorStore();
  const { isAboutMeOpen } = useAboutMeStore();
  const { isTerminalOpen } = useTerminalStore();
  const { isVsCodeOpen } = useVsCodeStore();
  const { isSpotifyOpen } = useSpotifyStore();
  const { isSettingOpen } = useSettingStore();
  const { wallpaper } = useWallpaperStore();
  const { isContactOpen } = useContactStore();

  return (
    <div className="w-full h-full bg-cover bg-center">
      <Image
        src={wallpaper}
        alt="bg"
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
      />
      {isBrowserOpen && <BrowserWindow />}
      {isCalculatorOpen && <CalculatorWindow />}
      {isAboutMeOpen && <AboutMeWindow />}
      {isTerminalOpen && <TerminalWindow />}
      {isVsCodeOpen && <VSCodeWindow />}
      {isSpotifyOpen && <SpotifyWindow />}
      {isSettingOpen && <SettingsWindow />}
      {isContactOpen && <ContactWindow />}
    </div>
  );
}
