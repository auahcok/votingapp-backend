import mongoose, { Document, Schema } from 'mongoose';
import { EventType } from './event.dto';

// Candidate Schema
const CandidateSchema: Schema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  }, // Relasi ke Event
  photo: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  sequence: { type: Number, required: true }, // Menggunakan Number sesuai contoh
  visi: { type: String, required: true },
  misi: { type: String, required: true },
  comment: { type: String, required: true },
});

// Event Schema
const EventSchema: Schema<EventType> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    startDate: { type: String, required: true }, // Date
    endDate: { type: String, required: true }, // Date
    candidates: [CandidateSchema], // Menggunakan CandidateSchema sebagai subdocument
  },
  { timestamps: true },
);

export interface IEventDocument extends Document, EventType {}
const Event = mongoose.model<EventType>('Event', EventSchema);
export default Event;
