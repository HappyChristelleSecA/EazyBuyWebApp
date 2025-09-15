"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaStar, FaThumbsUp, FaCheckCircle } from "react-icons/fa"
import { getReviewsByProductId, type Review } from "@/lib/reviews"
import { useState } from "react"

interface ReviewListProps {
  productId: string
}

interface ReviewItemProps {
  review: Review
}

function ReviewItem({ review }: ReviewItemProps) {
  const [helpful, setHelpful] = useState(review.helpful)
  const [hasVoted, setHasVoted] = useState(false)

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(helpful + 1)
      setHasVoted(true)
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{review.userName}</span>
            {review.verified && (
              <Badge variant="secondary" className="text-xs">
                <FaCheckCircle className="h-3 w-3 mr-1" />
                Verified Purchase
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{review.date}</span>
        </div>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        <h4 className="font-medium mb-2">{review.title}</h4>
        <p className="text-muted-foreground mb-3">{review.comment}</p>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={hasVoted}
            className="text-muted-foreground hover:text-foreground"
          >
            <FaThumbsUp className="h-3 w-3 mr-1" />
            Helpful ({helpful})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewList({ productId }: ReviewListProps) {
  const reviews = getReviewsByProductId(productId)
  const [showAll, setShowAll] = useState(false)
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>

      {displayedReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}

      {reviews.length > 3 && !showAll && (
        <Button variant="outline" onClick={() => setShowAll(true)} className="w-full">
          Show All {reviews.length} Reviews
        </Button>
      )}

      {showAll && reviews.length > 3 && (
        <Button variant="outline" onClick={() => setShowAll(false)} className="w-full">
          Show Less
        </Button>
      )}
    </div>
  )
}
