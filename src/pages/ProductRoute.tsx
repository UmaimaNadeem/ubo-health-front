import { useParams } from "react-router-dom";
import Product from "./Product";
import Treatment from "./Treatment";
import { TREATMENTS } from "../data/treatments";

/** /product/:slug — OBU treatments get the new page; anything else keeps the existing API-driven page. */
export default function ProductRoute() {
  const { slug = "" } = useParams();
  const treatment = TREATMENTS[slug];
  return treatment ? <Treatment treatment={treatment} /> : <Product />;
}
