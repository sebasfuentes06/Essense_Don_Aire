"use client";
import { useState } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "./utils";
import { DeleteDialog } from "./DeleteDialog";
function Switch({
  className,
  onCheckedChange,
  itemName,
  confirmTitle = "¿Desactivar este elemento?",
  confirmDescription = "Esta acción desactivará el registro y podrá activarse nuevamente más adelante.",
  confirmLabel = "Sí, Desactivar",
  confirmingLabel = "Desactivando...",
  warningText = "⚠️ Esta acción desactivará el registro",
  ...props
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleCheckedChange = (checked) => {
    if (!checked) {
      setConfirmOpen(true);
      return;
    }
    onCheckedChange?.(checked);
  };
  const handleConfirmDeactivate = () => {
    onCheckedChange?.(false);
    setConfirmOpen(false);
  };

  return <>
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
    <DeleteDialog
      isOpen={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmDeactivate}
      title={confirmTitle}
      description={confirmDescription}
      itemName={itemName}
      confirmLabel={confirmLabel}
      confirmingLabel={confirmingLabel}
      warningText={warningText}
    />
  </>;
}
export {
  Switch
};
