"use client";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useChainId, useSendTransaction } from "wagmi";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "../ui/input";
import { parseEther } from "viem";
import { mainnet, polygon } from "@lens-protocol/react-web";

export function Tip() {
  return (
    <div className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
      <TipDrawer />
    </div>
  );
}
function PointerIcon({ ...props }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" />
      <path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

export function TipDrawer() {
  const [amount, setAmount] = useState("");
  const chainId = useChainId();
  const { sendTransaction } = useSendTransaction();

  const handleSend = async () => {
    try {
      sendTransaction({
        to: process.env.NEXT_PUBLIC_TIP_ADDRESS as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const currency = useCallback(() => {
    return chainId === polygon.chainId ? "MATIC" : "ETH";
  }, [chainId]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="flex items-center gap-2"
        >
          <PointerIcon className="h-5 w-5" />
          <span>Send Tip</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="space-y-4">
            <DrawerTitle>Send a tip!</DrawerTitle>
            <DrawerDescription>
              Did this tool help you? Send a tip to show your appreciation!{" "}
              <br />
              <br />
              This tool was created by
              <a
                href="https://x.com/hone1er"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {" "}
                @hone1er
              </a>
              ! Follow on X for more updates. 🚀
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="mt-3">
              <Input
                placeholder={`Amount in ${currency()} `}
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSend}>Send</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
