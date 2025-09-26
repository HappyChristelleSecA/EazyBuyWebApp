"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FaStar } from "react-icons/fa"
import { useAuth } from "@/hooks/use-auth"
import { addReview, hasUserReviewedProduct } from "@/lib/reviews"
import { useToast } from "@/hooks/use-toast"

interface AddReviewFormProps {
  productId: string
  onReviewAdded?: () => void
  refreshKey?: number
}

export function AddReviewForm({ productId, onReviewAdded, refreshKey }: AddReviewFormProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const alreadyReviewed = hasUserReviewedProduct(productId, user.id)
      setHasReviewed(alreadyReviewed)
      console.log("[v0] Checking if user has reviewed product", {
        productId,
        userId: user.id,
        hasReviewed: alreadyReviewed,
      })
    }
  }, [productId, user, isAuthenticated, refreshKey])

  const handleSignIn = () => {
    router.push("/auth")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Review submission started", { productId, user: user?.email, rating, title, comment })

    if (isSubmitting) {
      console.log("[v0] Submission already in progress, ignoring")
      return
    }

    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to write a review.",
        variant: "destructive",
      })
      return
    }

    const currentlyHasReview = hasUserReviewedProduct(productId, user.id)
    if (currentlyHasReview) {
      console.log("[v0] Duplicate review attempt blocked")
      console.log("[v0] Showing duplicate review toast")
      toast({
        title: "Review already submitted",
        description: "You have already posted a review for this item.",
        variant: "destructive",
      })
      console.log("[v0] Toast called for duplicate review")
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newReview = addReview({
        productId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating,
        title,
        comment,
        verified: true, // Assume verified if user is authenticated
      })

      console.log("[v0] Review added successfully", newReview)

      toast({
        title: "Review submitted!",
        description: "Thank you for your review. It has been published successfully.",
      })

      setRating(0)
      setTitle("")
      setComment("")

      setHasReviewed(true)

      onReviewAdded?.()
    } catch (error) {
      console.log("[v0] Review submission error", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <FaStar
                    className={`h-6 w-6 ${
                      star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating > 0 && `${rating} star${rating !== 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting || hasReviewed} className="w-full">
            {isSubmitting ? "Submitting..." : hasReviewed ? "Already Reviewed" : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
