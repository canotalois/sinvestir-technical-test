"use client";

import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { Frequency } from "../core/types";
import {
  InfoIcon,
  BookmarkPlusIcon,
  ShareIcon,
  DownloadIcon,
  CloseIcon,
} from "./icons";
import { Button } from "./Button";

export interface SimParams {
  readonly coinId: string;
  readonly amount: number;
  readonly frequency: Frequency;
  readonly from: string;
  readonly to: string;
}

interface SaveShareModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly sim: SimParams;
  readonly onDownloadImage: () => void | Promise<void>;
}

const FIELD =
  "h-[52px] w-full rounded-lg border border-blue-sky/25 bg-blue-sky/5 px-[18px] text-sm text-white outline-none transition-colors placeholder:text-blue-light/60 focus:border-blue-sky";

function readSims(): unknown[] {
  try {
    const raw = window.localStorage.getItem("si-crypto-sims");
    const parsed: unknown = raw !== null ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SaveShareModal({
  open,
  onClose,
  sim,
  onDownloadImage,
}: SaveShareModalProps) {
  const [scene, setScene] = useState<"save" | "share">("save");
  const [name, setName] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setScene("save");
      setName("");
      setShareUrl("");
      setCopied(false);
    }
  }, [open]);

  function handleSave() {
    const trimmed = name.trim();
    if (trimmed === "") return;
    const id = Math.random().toString(36).slice(2, 14);
    try {
      window.localStorage.setItem(
        "si-crypto-sims",
        JSON.stringify([
          ...readSims(),
          { id, name: trimmed, ...sim, savedAt: Date.now() },
        ]),
      );
    } catch {
      /* storage unavailable (private mode): continue, the link stays shareable */
    }
    const origin = window.location.origin;
    setShareUrl(`${origin}/share/crypto?share_id=${id}`);
    setScene("share");
  }

  function handleCopy() {
    if (navigator.clipboard === undefined) return;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => setCopied(true))
      .catch(() => {
        /* clipboard unavailable: ignore */
      });
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="si-modal-overlay fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="si-modal-content fixed left-1/2 top-1/2 z-[60] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-blue-sky/10 bg-blue-sky/5 p-6 shadow-2xl backdrop-blur-3xl"
        >
          <DialogPrimitive.Title className="text-center text-xl font-normal text-white">
            {scene === "save"
              ? "Enregistrer votre simulation"
              : "Partager ma simulation"}
          </DialogPrimitive.Title>

          <DialogPrimitive.Close
            aria-label="Fermer"
            className="absolute right-5 top-5 text-white/60 transition-colors hover:text-white"
          >
            <CloseIcon />
          </DialogPrimitive.Close>

          {scene === "save" ? (
            <>
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-blue-sky/30 bg-blue-sky/10 px-3 py-3 text-xs font-light text-blue-light">
                <InfoIcon
                  width={14}
                  height={14}
                  className="shrink-0 text-blue-light"
                />
                Sauvegarder votre simulation pour la partager
              </div>
              <input
                type="text"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                placeholder="Nom de ma simulation"
                className={`mt-4 ${FIELD}`}
              />
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 !text-xs"
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 !text-xs"
                  onClick={handleSave}
                  disabled={name.trim() === ""}
                  icon={<BookmarkPlusIcon />}
                >
                  Enregistrer
                </Button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className={`mt-6 ${FIELD} text-blue-light`}
              />
              <div className="mt-6 flex gap-3">
                <Button
                  className="flex-1 !text-xs"
                  onClick={handleCopy}
                  icon={<ShareIcon />}
                >
                  {copied ? "Lien copié ✓" : "Copier le lien"}
                </Button>
                <Button
                  className="flex-1 !text-xs"
                  onClick={() => void onDownloadImage()}
                  icon={<DownloadIcon />}
                >
                  Télécharger l&apos;image
                </Button>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
