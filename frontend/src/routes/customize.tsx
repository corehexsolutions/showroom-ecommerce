import CustomizePage from "@/pages/CustomizePage";
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/customize')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <CustomizePage/>
    </>
  )
}