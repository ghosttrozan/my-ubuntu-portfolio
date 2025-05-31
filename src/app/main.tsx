"use client";

import HomePage from "./homepage";
import TopPanel from "./topPanel";
import { useLockStore } from "../store/lockStore";
import { usePowerStore } from "../store/powerStore";
import LockScreen from "./lockScreen";
import PowerScreen from "./powerScreen";
import LeftSideBar from "./leftSideBar";
import BrowserWindow from "./browserWindow";

export default function Main() {
  const { isLocked } = useLockStore();
  const { isPowerOn } = usePowerStore();


  return (
    <div>
      {isPowerOn ? (
        <div>
          {isLocked ? (
            <LockScreen />
          ) : (
            <>
              <TopPanel />
              <LeftSideBar />
              <HomePage />
            </>
          )}
        </div>
      ) : (
        <PowerScreen />
      )}
    </div>
  );
}
