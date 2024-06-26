"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/components/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "../hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "invite";
  const [copied, setCopied] = useState(false);
  const origin = useOrigin();
  const [isLoading, setIsLoading] = useState(false);

  //@ts-ignore
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white dark:bg-zinc-600 dark:text-white text-black p-0 overflow-hidden">
          {isLoading && (
            <>
              <div className="flex items-center justify-center align-middle h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500 my-4" />
              </div>
            </>
          )}
          {!isLoading && (
            <>
              {" "}
              <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                  Invite Friends!
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <Label className="upercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Server Invite Link
                </Label>
                <div className="flex items-center mt-2 gap-x-2">
                  <Input
                    disabled={isLoading}
                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-black/50"
                    value={inviteUrl}
                  ></Input>
                  <Button size="icon" onClick={onCopy} disabled={isLoading}>
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-zinc-500 mt-4"
                  disabled={isLoading}
                  onClick={onNew}
                >
                  Generate a new Link
                  <RefreshCcw className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
