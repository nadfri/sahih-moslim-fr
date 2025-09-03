"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type EventHandlers = {
  onImportFile: (file: File, endpoint: string) => void;
  onRestoreFile?: (file: File | null) => void;
  onImportDone: () => void;
  onImportFailed: (failed: Array<{ item?: unknown; reason: string }>) => void;
  onCloseImportModal: () => void;
  onRestoreDone?: () => void;
  onRestoreFailed?: () => void;
  onCloseRestoreModal?: () => void;
};

export function useDataManagementEvents(handlers: EventHandlers) {
  const router = useRouter();

  useEffect(() => {
    const handleImportFile = (e: Event) => {
      const custom = e as CustomEvent<{ file: File; endpoint: string }>;
      const { file, endpoint } = custom.detail || {};
      if (file && endpoint) {
        handlers.onImportFile(file, endpoint);
      }
    };

    const handleRestoreFile = (e: Event) => {
      const custom = e as CustomEvent<{ file: File | null }>;
      const { file } = custom.detail || {};
      if (handlers.onRestoreFile) {
        handlers.onRestoreFile(file);
      }
    };

    const handleImportDone = () => {
      handlers.onImportDone();
      router.refresh();
    };

    const handleImportFailed = (e: Event) => {
      const custom = e as CustomEvent<{
        failed: Array<{ item?: unknown; reason: string }>;
      }>;
      const { failed } = custom.detail || {};
      if (Array.isArray(failed) && failed.length > 0) {
        handlers.onImportFailed(failed);
      }
    };

    const handleCloseImportModal = () => {
      handlers.onCloseImportModal();
    };

    const handleRestoreDone = () => {
      if (handlers.onRestoreDone) {
        handlers.onRestoreDone();
        router.push("/");
      }
    };

    const handleRestoreFailed = () => {
      if (handlers.onRestoreFailed) {
        handlers.onRestoreFailed();
      }
    };

    const handleCloseRestoreModal = () => {
      if (handlers.onCloseRestoreModal) {
        handlers.onCloseRestoreModal();
      }
    };

    // Add all event listeners
    window.addEventListener("admin:import-file", handleImportFile);
    window.addEventListener(
      "admin:restore-file",
      handleRestoreFile as EventListener
    );
    window.addEventListener("admin:import-done", handleImportDone);
    window.addEventListener(
      "admin:import-failed-items",
      handleImportFailed as EventListener
    );
    window.addEventListener("admin:close-import-modal", handleCloseImportModal);
    window.addEventListener("admin:restore-done", handleRestoreDone);
    window.addEventListener("admin:restore-failed", handleRestoreFailed);
    window.addEventListener(
      "admin:close-restore-modal",
      handleCloseRestoreModal
    );

    return () => {
      // Remove all event listeners
      window.removeEventListener("admin:import-file", handleImportFile);
      window.removeEventListener(
        "admin:restore-file",
        handleRestoreFile as EventListener
      );
      window.removeEventListener("admin:import-done", handleImportDone);
      window.removeEventListener(
        "admin:import-failed-items",
        handleImportFailed as EventListener
      );
      window.removeEventListener(
        "admin:close-import-modal",
        handleCloseImportModal
      );
      window.removeEventListener("admin:restore-done", handleRestoreDone);
      window.removeEventListener("admin:restore-failed", handleRestoreFailed);
      window.removeEventListener(
        "admin:close-restore-modal",
        handleCloseRestoreModal
      );
    };
  }, [handlers, router]);
}
