"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaStar, FaThumbsUp, FaCheckCircle, FaTrash } from "react-icons/fa"
import { getReviewsByProductId, deleteReview, type Review } from "@/lib/reviews"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"

interface ReviewListProps {
  productId: string
  refreshKey?: number
  onReviewDeleted?: () => void
}

interface ReviewItemProps {
  review: Review
  currentUserId?: string
  onDelete: (reviewId: string) => void
}

function ReviewItem({ review, currentUserId, onDelete }: ReviewItemProps) {
  const [helpful, setHelpful] = useState(review.helpful)
  const [hasVoted, setHasVoted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(helpful + 1)
      setHasVoted(true)
    }
  }

  const handleDelete = async () => {
    if (!currentUserId) return

    setIsDeleting(true)
    try {
      deleteReview(review.id, currentUserId)
      onDelete(review.id)
    } catch (error) {
      console.error("[v0] Error deleting review:", error)
      alert("Failed to delete review")
    } finally {
      setIsDeleting(false)
    }
  }

  const canDelete = currentUserId === review.userId

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
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{review.date}</span>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <FaTrash className="h-3 w-3" />
              </Button>
            )}
          </div>
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

export function ReviewList({ productId, refreshKey, onReviewDeleted }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAll, setShowAll] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    console.log("[v0] ReviewList refreshing reviews for product", productId)
    const productReviews = getReviewsByProductId(productId)
    console.log("[v0] Found reviews:", productReviews.length)
    setReviews(productReviews)
  }, [productId, refreshKey])

  const handleReviewDeleted = (reviewId: string) => {
    console.log("[v0] Review deleted, refreshing list")
    const updatedReviews = getReviewsByProductId(productId)
    setReviews(updatedReviews)
    onReviewDeleted?.()
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>

      {displayedReviews.map((review) => (
        <ReviewItem key={review.id} review={review} currentUserId={user?.id} onDelete={handleReviewDeleted} />
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
