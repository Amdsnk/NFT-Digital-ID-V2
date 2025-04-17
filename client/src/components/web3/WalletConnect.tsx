import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/hooks/useWeb3";
import { truncateAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function WalletConnect() {
  const { connect, disconnect, isConnected, address, connectedChain, error } = useWeb3();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await connect();
    } catch (err) {
      console.error("Connection error:", err);
      toast({
        title: "Wallet Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Wallet Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          onClick={handleDisconnect}
        >
          <i className="fas fa-wallet mr-1"></i>
          <span className="hidden md:inline">{truncateAddress(address)}</span>
          <span className="md:hidden">{truncateAddress(address, 4)}</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2"
    >
      {isConnecting ? (
        <>
          <i className="fas fa-spinner fa-spin mr-1"></i>
          Connecting...
        </>
      ) : (
        <>
          <i className="fas fa-wallet mr-1"></i>
          Connect Wallet
        </>
      )}
    </Button>
  );
}
