"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/components/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { Loader2 } from "lucide-react";

export const DeleteMessageModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  //@ts-ignore
  const { apiUrl, query } = data;

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `${apiUrl}`,
        query: query,
      });

      await axios.delete(url);
      onClose();
      router.refresh();
      onClose();
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
          {!isLoading && (
            <>
              <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                  Delete Message
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                  Are you sure you want to delete the message permanently?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="bg-gray-100 dark:bg-gray-600 px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <Button
                    disabled={isLoading}
                    onClick={onClose}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isLoading}
                    onClick={onDelete}
                    variant="primary"
                  >
                    Confirm
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
          {isLoading && (
            <>
              <div className="flex items-center justify-center align-middle h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500 my-4" />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
