"use client";
import {
  type LensConfig,
  LensProvider,
  production,
  type Session,
} from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { type State, WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
interface Props extends PropsWithChildren {
  initialState?: State;
  session?: Session;
}
/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  */
const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [polygon, mainnet],
  connectors: [
    coinbaseWallet(),
    walletConnect({
      projectId: "71e372bcecd07f66c58d3895a4ba0131",
    }),
  ],

  transports: {
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
});

const lensConfig: LensConfig = {
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  */
  environment: production,
  bindings: bindings(wagmiConfig),
};
const metadata = {
  name: "Honefolio",
  description: "Joe Villavicensio's portfolio",
  url: "https://honefolio.vercel.app", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
createWeb3Modal({
  metadata,
  projectId: "71e372bcecd07f66c58d3895a4ba0131",
  wagmiConfig,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: true,
});

export function Web3Provider({ initialState, session, children }: Props) {
  return (
    <WagmiProvider initialState={initialState} config={wagmiConfig}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  */}
      <QueryClientProvider client={queryClient}>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment  */}
        <LensProvider config={lensConfig}>{children}</LensProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
