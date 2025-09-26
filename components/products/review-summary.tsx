"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FaStar } from "react-icons/fa"
import { getReviewStats } from "@/lib/reviews"

interface ReviewSummaryProps {
  productId: string
  refreshKey?: number
}

export function ReviewSummary({ productId, refreshKey }: ReviewSummaryProps) {
  const [stats, setStats] = useState(() => getReviewStats(productId))

  useEffect(() => {
    console.log("[v0] ReviewSummary refreshing stats for product", productId)
    const newStats = getReviewStats(productId)
    console.log("[v0] Updated stats:", newStats)
    setStats(newStats)
  }, [productId, refreshKey])

  if (stats.totalReviews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.averageRating}</div>
            <div className="flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">{stats.totalReviews} reviews</div>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm w-8">{rating}</span>
                <FaStar className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <Progress
                  value={
                    (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) *
                    100
                  }
                  className="flex-1 h-2"
                />
                <span className="text-sm text-muted-foreground w-8">
                  {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
