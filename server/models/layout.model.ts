import {Schema , model , Document} from "mongoose";

interface FaqItem extends Document {
  question: string,
  answer: string
}

interface Category extends Document {
  title: string,
}

interface BannerImage extends Document {
  public_id: string,
  url: string
}

interface Layout extends Document {
  type: string,
  faq : Array<FaqItem>,
  categories : Array<Category>,
  banner : {
    image : BannerImage,
    title : string,
    subTitle : string
  }
}

const faqSchema: Schema = new Schema({
  question: { type: String },
  answer: { type: String }
});

const categorySchema: Schema = new Schema({
  title: { type: String }
});

const bannerImageSchema: Schema = new Schema({
  public_id: { type: String },
  url: { type: String }
});

const layoutSchema: Schema = new Schema({
  type: { type: String },
  faq: [faqSchema],
  categories: [categorySchema],
  banner: {
    image: bannerImageSchema,
    title: { type: String },
    subTitle: { type: String }
  }
});

const LayoutModel = model<Layout>("Layout" , layoutSchema);

export default LayoutModel;