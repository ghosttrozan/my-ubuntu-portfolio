import Image from "next/image";
import wall1 from "../../public/assets/wall2.png";
import BrowserWindow from "./browserWindow";

export default function HomePage() {
  return (
    <div  className="w-full h-full bg-cover bg-center">
      <Image
        src={wall1}
        alt="bg"
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
      />
      <BrowserWindow/>
    </div>
  );
}
