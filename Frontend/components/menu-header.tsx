import { Grid3X3 } from "lucide-react"

export function MenuHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <Grid3X3 className="h-5 w-5 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Menus</h1>
    </div>
  )
}
