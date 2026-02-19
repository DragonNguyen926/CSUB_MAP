import { supabase } from "../lib/supabaseClient";

/**
 * Upload a flyer image to Supabase Storage and save the public URL into events.flyer_url
 *
 * fileUri: Expo local URI (from ImagePicker, etc)
 */
export async function uploadEventFlyer(eventId: string, fileUri: string): Promise<string> {
  // Get file bytes
  const res = await fetch(fileUri);
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();

  // Create a unique path per event
  const path = `${eventId}/${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("event-flyers")
    .upload(path, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  // Public URL (bucket must be public)
  const { data: publicData } = supabase.storage
    .from("event-flyers")
    .getPublicUrl(path);

  const flyerUrl = publicData.publicUrl;

  // Save URL to event row
  const { error: updateError } = await supabase
    .from("events")
    .update({ flyer_url: flyerUrl })
    .eq("id", eventId);

  if (updateError) throw new Error(updateError.message);

  return flyerUrl;
}
