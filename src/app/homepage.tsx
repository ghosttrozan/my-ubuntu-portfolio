import Image from "next/image";
import wall1 from "../../public/assets/wall2.png";
import BrowserWindow from "./browserWindow";
import { useBrowserStore } from '../store/browserWindowStore'
import { useCalculatorStore } from '../store/calculatorWindowStore'
import { useAboutMeStore } from '../store/aboutMeWindow'
import CalculatorWindow from "./calcutaorWindow";
import AboutMeWindow from "./aboutMeWindow";

export default function HomePage() {

  const {isBrowserOpen} = useBrowserStore()
  const { isCalculatorOpen } = useCalculatorStore()
  const { isAboutMeOpen } = useAboutMeStore()


  return (
    <div  className="w-full h-full bg-cover bg-center">
      <Image
        src={wall1}
        alt="bg"
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
      />
    {
      isBrowserOpen && <BrowserWindow/>
    }
    {
      isCalculatorOpen && <CalculatorWindow/>
    }
    {
      isAboutMeOpen && <AboutMeWindow />
    }
    </div>
  );
}
