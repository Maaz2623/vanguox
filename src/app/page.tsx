import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ClientGreeting } from './client-greeting'

const HomePage = () => {

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.hello.queryOptions({
    text: "Mohammed Maaz"
  }))

  return (
     <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>

      <ClientGreeting />
      </Suspense>
    </HydrationBoundary>
  )
}

export default HomePage