import { Schema, model } from "mongoose";

import {handleSaveError, handleUpdateValidate} from "./hooks.js"

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      match: /.+@.+\..+/i,
      required: true,
    },
    phone: {
      type: String,
      required: [true, 'Enter a contact phone number'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      // require: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    }
  }, 
    {versionKey: false}
  );

  contactSchema.pre("findOneAndUpdate", handleUpdateValidate);

  contactSchema.post("save", handleSaveError);

  contactSchema.post("findOneAndUpdate", handleSaveError);

  const Contact = model("contact", contactSchema);

  export default Contact;