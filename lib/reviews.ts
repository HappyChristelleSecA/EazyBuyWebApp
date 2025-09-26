export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
}

// Mock reviews data
export const reviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    userName: "Sarah Johnson",
    userEmail: "sarah@example.com",
    rating: 5,
    title: "Excellent sound quality!",
    comment:
      "These headphones exceeded my expectations. The noise cancellation is fantastic and the battery life is exactly as advertised. Highly recommend!",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
  },
  {
    id: "2",
    productId: "1",
    userId: "user2",
    userName: "Mike Chen",
    userEmail: "mike@example.com",
    rating: 4,
    title: "Great value for money",
    comment:
      "Good headphones overall. The sound quality is great, though I wish the bass was a bit stronger. Comfortable for long listening sessions.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
  },
  {
    id: "3",
    productId: "1",
    userId: "user3",
    userName: "Emily Davis",
    userEmail: "emily@example.com",
    rating: 4,
    title: "Comfortable and reliable",
    comment:
      "I use these daily for work calls and music. Very comfortable even after hours of use. The connection is stable and setup was easy.",
    date: "2024-01-05",
    verified: false,
    helpful: 5,
  },
  {
    id: "4",
    productId: "3",
    userId: "user4",
    userName: "Alex Thompson",
    userEmail: "alex@example.com",
    rating: 5,
    title: "Perfect fit and quality",
    comment:
      "Love this organic cotton t-shirt! The fabric is so soft and the fit is perfect. Will definitely buy more colors.",
    date: "2024-01-12",
    verified: true,
    helpful: 15,
  },
  {
    id: "5",
    productId: "5",
    userId: "user5",
    userName: "Jessica Wilson",
    userEmail: "jessica@example.com",
    rating: 5,
    title: "Best yoga mat I've owned",
    comment:
      "This mat has excellent grip and cushioning. Perfect thickness for all types of yoga. The quality is outstanding and it's easy to clean.",
    date: "2024-01-08",
    verified: true,
    helpful: 22,
  },
]

export const getReviewsByProductId = (productId: string): Review[] => {
  return reviews.filter((review) => review.productId === productId)
}

export const getReviewStats = (productId: string) => {
  const productReviews = getReviewsByProductId(productId)
  const totalReviews = productReviews.length

  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let totalRating = 0

  productReviews.forEach((review) => {
    totalRating += review.rating
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  return {
    averageRating: Number((totalRating / totalReviews).toFixed(1)),
    totalReviews,
    ratingDistribution,
  }
}

export const hasUserReviewedProduct = (productId: string, userId: string): boolean => {
  return reviews.some((review) => review.productId === productId && review.userId === userId)
}

export const addReview = (review: Omit<Review, "id" | "date" | "helpful">): Review => {
  if (hasUserReviewedProduct(review.productId, review.userId)) {
    throw new Error("You have already reviewed this product")
  }

  const newReview: Review = {
    ...review,
    id: `review-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    helpful: 0,
  }
  reviews.push(newReview)
  return newReview
}

export const deleteReview = (reviewId: string, userId: string): boolean => {
  const reviewIndex = reviews.findIndex((review) => review.id === reviewId)

  if (reviewIndex === -1) {
    throw new Error("Review not found")
  }

  const review = reviews[reviewIndex]
  if (review.userId !== userId) {
    throw new Error("You can only delete your own reviews")
  }

  reviews.splice(reviewIndex, 1)
  console.log("[v0] Review deleted:", reviewId)
  return true
}
