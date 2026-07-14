import ProductPage from "@/components/ProductPage";
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/product/$id/')({
  component: ProductPage,
})






