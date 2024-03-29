import Image from "next/image";
import { BackgroundBeams } from "./components/ui/background-beams";
import AirDrop from "./components/AirDrop";

export default function Home() {
  return (
    <>
      <BackgroundBeams />
      <AirDrop />
    </>
  );
}
