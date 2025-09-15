"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FaStar } from "react-icons/fa"
import { useAuth } from "@/hooks/use-auth"
import { addReview } from "@/lib/reviews"
import { useToast } from "@/hooks/use-toast"

interface AddReviewFormProps {
  productId: string
  onReviewAdded?: () => void
}

export function AddReviewForm({ productId, onReviewAdded }: AddReviewFormProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to write a review.",
        variant: "destructive",
      })
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
      addReview({
        productId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating,
        title,
        comment,
        verified: true, // Assume verified if user is authenticated
      })

      toast({
        title: "Review submitted!",
        description: "Thank you for your review. It has been published successfully.",
      })

      // Reset form
      setRating(0)
      setTitle("")
      setComment("")

      // Notify parent component
      onReviewAdded?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to write a review</p>
          <Button variant="outline">Sign In</Button>
        </CardContent>
      </Card>
    )
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
