import { useEffect } from "react";

import Seo from "@/components/Seo";
import MainScreen from "@/modules/Home/mainScreen";


const Index = () => {
  useEffect(() => {
    document.body.classList.add("home");
  }, []);

  return (
    <>
      <Seo />
        <MainScreen />
    </>
  );
};
export default Index;
