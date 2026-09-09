import { Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/Card";

/**
 * Meta personal del mes y posición en el ranking de vendedores.
 * El ranking muestra el puesto, no las cifras de los demás vendedores.
 */
function SellerGoalCard({ goal, rank, sellersCount }) {
  const remaining = Math.max(0, goal.target - goal.achieved);
  const reached = goal.achieved >= goal.target;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>Tu meta del mes</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-3xl font-bold text-foreground">${goal.achieved.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">de ${goal.target.toFixed(2)}</p>
          </div>
          <span className="text-2xl font-bold text-primary">{goal.percent}%</span>
        </div>

        <div
          className="h-3 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={goal.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Avance de tu meta mensual"
        >
          <div
            className={reached ? "h-full rounded-full bg-success" : "h-full rounded-full bg-primary"}
            style={{ width: `${goal.percent}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {reached
            ? "¡Meta cumplida! Todo lo que venga suma por encima."
            : `Te faltan $${remaining.toFixed(2)} para alcanzarla.`}
        </p>

        {rank && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Puesto {rank} de {sellersCount}
              </p>
              <p className="text-sm text-muted-foreground">
                Tu posición entre los vendedores este periodo
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { SellerGoalCard };
