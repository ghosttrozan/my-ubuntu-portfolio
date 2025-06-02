"use client";

import HomePage from "./homepage";
import TopPanel from "./topPanel";
import { useLockStore } from "../store/lockStore";
import { usePowerStore } from "../store/powerStore";
import LockScreen from "./lockScreen";
import PowerScreen from "./powerScreen";
import LeftSideBar from "./leftSideBar";
import BrowserWindow from "./browserWindow";
import RightSideBar from "./rightSideBar";
import Visitors from "@/components/trackVisitor";

export default function Main() {
  const { isLocked } = useLockStore();
  const { isPowerOn } = usePowerStore();


  return (
    <div>
      <div className="absolute bottom-10 left-16 w-36 text-center h-10 rounded-2xl z-20">
              <Visitors />
            </div>
      {isPowerOn ? (
        <div>
          {isLocked ? (
            <LockScreen />
          ) : (
            <>
              <TopPanel />
              <LeftSideBar />
              <RightSideBar />
            </>
          )}
        </div>
      ) : (
        <PowerScreen />
      )}
    </div>
  );
}
