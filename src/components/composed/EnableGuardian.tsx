"use client";
import React from "react";
import { useWriteContract } from "wagmi";
import { Button } from "../ui/button";
import { SessionType, useSession } from "@lens-protocol/react-web";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
const EnableGuardian = ({ isDisabled = false }: { isDisabled?: boolean }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const { writeContractAsync, isPending } = useWriteContract();
  const { toast } = useToast();
  const handleWriteContract = async () => {
    setLoading(true);
    try {
      await writeContractAsync(
        {
          abi: [
            {
              constant: false,
              inputs: [],
              name: "enableTokenGuardian",
              outputs: [],
              payable: false,
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          address: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
          functionName: "enableTokenGuardian",
        },
        {
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message,
            });
          },
          onSuccess: (result) => {
            toast({
              title: "Guardian Enabled",
              description:
                "Your guardian has been enabled. Your profile is now protected and cannot be transferred.",
              action: (
                <ToastAction
                  altText="View Transaction"
                  onClick={() => {
                    window.open(`https://polyscan.io/tx/${result}`, "_blank");
                  }}
                >
                  View Transaction
                </ToastAction>
              ),
            });
          },
        },
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      className="w-full max-w-80"
      disabled={loading || isDisabled || isPending}
      onClick={async () => {
        await handleWriteContract();
      }}
    >
      Enable Guardian
    </Button>
  );
};

export default EnableGuardian;
