import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar este elemento?',
  description = 'Esta acción no se puede deshacer. El elemento será eliminado permanentemente.',
  itemName,
  isDeleting = false
}: DeleteDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center py-4">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2">
          {title}
        </h3>

        {/* Item Name */}
        {itemName && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted mb-3">
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-foreground">{itemName}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          {description}
        </p>

        {/* Warning Alert */}
        <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20 mb-6">
          <p className="text-sm text-destructive font-medium">
            ⚠️ Esta acción es permanente y no se puede deshacer
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            size="lg"
            className="flex-1"
            onClick={onConfirm}
            loading={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
