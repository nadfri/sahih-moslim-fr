type Status = "checking" | "available" | "taken" | null;

export function NumeroStatus({ status }: { status: Status }) {
  if (status === "checking") {
    return (
      <p className="text-sm text-gray-500 absolute top-0 right-0">
        Vérification...
      </p>
    );
  }
  if (status === "available") {
    return (
      <p className="text-sm text-emerald-600 absolute top-0 right-0">
        ✓ Numéro disponible
      </p>
    );
  }
  return null;
}
