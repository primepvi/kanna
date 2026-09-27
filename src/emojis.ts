import { kui } from "kompozr";
import emojiMap from "../k.emojis.json" with { type: "json" };

export const emojis = kui.emojis(emojiMap);
