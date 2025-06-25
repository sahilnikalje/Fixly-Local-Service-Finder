import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: [
      {
        url: String,
        description: String,
      },
    ],
    response: {
      comment: String,
      date: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Review", reviewSchema)
