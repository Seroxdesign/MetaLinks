import { useSIWE, useModal, SIWESession } from "connectkit";
import { useAccount } from "wagmi";

export const useConnectWallet = () => {
  const { openSIWE, openSwitchNetworks } = useModal();
  const { isConnected } = useAccount();

  const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn } =
    useSIWE({
      onSignIn: (session?: SIWESession) => {
        // Do something with the data
      },
      onSignOut: () => {
        // Do something when signed out
      },
    });

  const handleSignIn = async () => {
    await signIn()?.then((session?: SIWESession) => {
      // Do something when signed in
    });
  };

  const handleSignOut = async () => {
    await signOut()?.then(() => {
      // Do something when signed out
    });
  };

  return {
    isSignedIn,
    isConnected: isConnected,
    handleSignIn,
    handleSignOut,
    isReady,
    isRejected,
    isLoading,
    handleConnectWallet: function () {
      openSIWE();
      openSwitchNetworks();
    },
    data,
  };
};
