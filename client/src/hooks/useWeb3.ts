import { useContext } from "react";
import Web3Context, { useWeb3 as useWeb3FromContext } from "@/context/Web3Context";

export function useWeb3() {
  return useWeb3FromContext();
}
