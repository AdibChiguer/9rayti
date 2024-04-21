import mongoose, {Document , Model , Schema} from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser,
  question: string,
  questionReplies?: Array<IComment>
}

interface IReview extends Document {
  user: IUser,
  rating: number,
  comment: string,
  commentReplies?: Array<IComment>
}

interface ILink extends Document {
  title: string,
  url: string
}

interface ICourseData extends Document {
  title: string,
  description: string,
  videoUrl: string,
  videoThumbnail: object,
  videoSection: string,
  videoLength: number,
  videoPlayer: string,
  links: Array<ILink>,
  suggestion: string,
  questions: Array<IComment>
}

interface ICourse extends Document {
  name: string,
  description?: string,
  price: number,
  estimatedPrice?: number,
  thumbnail: object,
  tags: string,
  level: string,
  demoUrl: string,
  benifits: {title: string}[],
  prerequisites: {title: string}[],
  reviews: Array<IReview>,
  courseData: Array<ICourseData>,
  ratings?: number,
  purchased?: number,
}

const reviewSchema: Schema = new mongoose.Schema({
  user: Object,
  rating: {
    type: Number,
    default: 0
  },
  comment: String,
  commentReplies: [Object]
});

const linksSchema: Schema = new mongoose.Schema({
  title: String,
  url: String
});

const commentSchema: Schema = new mongoose.Schema({
  user: Object,
  question: String,
  questionRpelies: [Object]
});

const courseDataSchema: Schema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  videoSection: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linksSchema],
  suggestion: String,
  questions: [commentSchema]
});

const courseSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  tags: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  demoUrl: {
    type: String,
    required: true
  },
  benifits: [
    {
      title: String
    }
  ],
  prerequisites: [
    {
      title: String
    }
  ],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0
  },
  purchased: {
    type: Number,
    default: 0
  }
}, {timestamps: true});

const CourseModel: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);

export default CourseModel;