import mongoose , {Document , Model , Schema} from "mongoose";

export interface INotification extends Document {
  title: string,
  message: string,
  status: string,
  userId: string
}

const notificationSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "unread"
  },
  userId: {
    type: String,
    required: true
  }
}, {timestamps: true});

const NotificationModel: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema);

export default NotificationModel;