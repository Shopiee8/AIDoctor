
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import data from "@/app/dashboard/data.json"

const icons = {
  "dollar-sign": <DollarSign className="h-4 w-4 text-muted-foreground" />,
  "user": <Users className="h-4 w-4 text-muted-foreground" />,
  "credit-card": <CreditCard className="h-4 w-4 text-muted-foreground" />,
  "activity": <Activity className="h-4 w-4 text-muted-foreground" />,
}

export function SectionCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.cards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {icons[card.icon as keyof typeof icons]}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.amount}</div>
            <p className="text-xs text-muted-foreground">{card.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
