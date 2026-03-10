import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ConversationSchema = new Schema(
    {
        botId: { type: Schema.Types.ObjectId, ref: 'Bot', required: true },
        userMessage: { type: String, required: true },
        aiMessage: { type: String },
        responseTimeMs: { type: Number, default: 0 },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Conversation = model('Conversation', ConversationSchema);
export default Conversation;
