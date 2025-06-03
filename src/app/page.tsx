import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'

const HomePage = () => {

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.hello.queryOptions({
    text: "Mohammed Maaz"
  }))

  return (
    <div>
      Hello World
    </div>
  )
}

export default HomePage