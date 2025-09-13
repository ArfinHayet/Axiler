import Header from "@/components/Header";
import Image from "next/image";
import Home from "./home/page";
import Product from "./products/page";


export default function HomePage() {
  return (
    <>
      <Home/>
      <Product/>
    </>
  );
}
